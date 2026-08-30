import { prisma } from "../lib/prisma.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import {
  generateAccessToken,
  generateRefreshTokenString,
  hashToken,
} from "../utils/jwt.js";
import { generateOtp, generateSecureToken, hashOtp } from "../utils/otp.js";
import {
  sendVerificationOtpEmail,
  sendPasswordResetEmail,
} from "./email.service.js";
import { AppError } from "../middlewares/errorHandler.middleware.js";
import {
  RegisterInput,
  LoginInput,
  ResetPasswordInput,
} from "../interfaces/index.js";
import { OtpType } from "@repo/database";

/**
 * Registers a new user account (Farmer or Mandi Operator).
 */
export async function registerUser(data: RegisterInput) {
  // 1. Check if email already exists
  const existingEmail = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingEmail) {
    throw new AppError(
      "An account with this email address already exists.",
      409,
      "EMAIL_EXISTS"
    );
  }

  // 2. Check if phone already exists
  if (data.phone) {
    const existingPhone = await prisma.user.findUnique({
      where: { phone: data.phone },
    });

    if (existingPhone) {
      throw new AppError(
        "An account with this phone number already exists.",
        409,
        "PHONE_EXISTS"
      );
    }
  }

  // 3. Hash password securely
  const passwordHash = await hashPassword(data.password);

  // 4. Create user record in database
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      passwordHash,
      role: data.role,
      isVerified: false,
    },
  });

  // 5. Generate and dispatch verification OTP
  const otp = generateOtp();
  const otpHash = hashOtp(otp);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await prisma.otpVerification.create({
    data: {
      identifier: user.email,
      userId: user.id,
      codeHash: otpHash,
      type: OtpType.EMAIL_VERIFICATION,
      expiresAt,
    },
  });

  // Dispatch verification email in background
  sendVerificationOtpEmail(user.email, user.name, otp).catch((err) => {
    console.error("Failed to send verification email:", err);
  });

  // 6. Generate access and refresh tokens
  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
  });

  const refreshTokenRaw = generateRefreshTokenString();
  const refreshTokenHash = hashToken(refreshTokenRaw);
  const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await prisma.refreshToken.create({
    data: {
      tokenHash: refreshTokenHash,
      userId: user.id,
      expiresAt: refreshExpiresAt,
    },
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    },
    accessToken,
    refreshToken: refreshTokenRaw,
    message: "Registration successful. Please verify your email with the OTP sent.",
  };
}

/**
 * Authenticates user credentials and issues new token pair.
 */
export async function loginUser(data: LoginInput) {
  const isEmail = data.identifier.includes("@");

  const user = isEmail
    ? await prisma.user.findUnique({
        where: { email: data.identifier.toLowerCase().trim() },
      })
    : await prisma.user.findUnique({
        where: { phone: data.identifier.trim() },
      });

  if (!user) {
    throw new AppError(
      "Invalid email/phone or password.",
      401,
      "INVALID_CREDENTIALS"
    );
  }

  const isPasswordValid = await comparePassword(data.password, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError(
      "Invalid email/phone or password.",
      401,
      "INVALID_CREDENTIALS"
    );
  }

  // Ensure account is verified before issuing session tokens
  if (!user.isVerified) {
    throw new AppError(
      "Your account is not verified. Please verify your email with the OTP sent during registration.",
      403,
      "ACCOUNT_NOT_VERIFIED"
    );
  }

  // Generate tokens
  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
  });

  const refreshTokenRaw = generateRefreshTokenString();
  const refreshTokenHash = hashToken(refreshTokenRaw);
  const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
    data: {
      tokenHash: refreshTokenHash,
      userId: user.id,
      expiresAt: refreshExpiresAt,
    },
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    },
    accessToken,
    refreshToken: refreshTokenRaw,
  };
}

/**
 * Refreshes an access token with rotation and reuse detection.
 */
export async function refreshAccessToken(refreshTokenRaw: string) {
  const tokenHash = hashToken(refreshTokenRaw);

  const storedToken = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!storedToken) {
    throw new AppError("Invalid refresh token.", 401, "INVALID_REFRESH_TOKEN");
  }

  // Reuse detection: Invalidate all sessions if token was already revoked
  if (storedToken.revokedAt) {
    await prisma.refreshToken.updateMany({
      where: { userId: storedToken.userId },
      data: { revokedAt: new Date() },
    });
    throw new AppError(
      "Refresh token has already been used. All active sessions invalidated for security.",
      401,
      "TOKEN_REUSE_DETECTED"
    );
  }

  // Check expiration
  if (storedToken.expiresAt < new Date()) {
    throw new AppError(
      "Refresh token has expired. Please log in again.",
      401,
      "REFRESH_TOKEN_EXPIRED"
    );
  }

  // Issue new token pair
  const user = storedToken.user;
  const newAccessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
  });

  const newRefreshTokenRaw = generateRefreshTokenString();
  const newRefreshTokenHash = hashToken(newRefreshTokenRaw);
  const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // Atomically rotate tokens
  await prisma.$transaction([
    prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: {
        revokedAt: new Date(),
        replacedByTokenHash: newRefreshTokenHash,
      },
    }),
    prisma.refreshToken.create({
      data: {
        tokenHash: newRefreshTokenHash,
        userId: user.id,
        expiresAt: refreshExpiresAt,
      },
    }),
  ]);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshTokenRaw,
  };
}

/**
 * Revokes refresh token to log out user.
 */
export async function logoutUser(refreshTokenRaw?: string) {
  if (refreshTokenRaw) {
    const tokenHash = hashToken(refreshTokenRaw);
    await prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
  return { success: true, message: "Logged out successfully." };
}

/**
 * Dispatches an OTP code for verification or password recovery.
 */
export async function sendOtp(identifier: string, type: OtpType) {
  const isEmail = identifier.includes("@");
  const user = isEmail
    ? await prisma.user.findUnique({
        where: { email: identifier.toLowerCase().trim() },
      })
    : await prisma.user.findUnique({
        where: { phone: identifier.trim() },
      });

  // Invalidate previous unconsumed OTPs
  await prisma.otpVerification.updateMany({
    where: {
      identifier,
      type,
      consumedAt: null,
    },
    data: { consumedAt: new Date() },
  });

  const otp = generateOtp();
  const otpHash = hashOtp(otp);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await prisma.otpVerification.create({
    data: {
      identifier,
      userId: user?.id || null,
      codeHash: otpHash,
      type,
      expiresAt,
    },
  });

  if (isEmail && user) {
    if (type === OtpType.EMAIL_VERIFICATION) {
      await sendVerificationOtpEmail(user.email, user.name, otp);
    } else if (type === OtpType.PASSWORD_RESET) {
      await sendPasswordResetEmail(user.email, user.name, otp, otp);
    }
  }

  return {
    success: true,
    message: `OTP sent successfully to ${identifier}. Valid for 10 minutes.`,
  };
}

/**
 * Validates and consumes OTP code.
 */
export async function verifyOtp(
  identifier: string,
  code: string,
  type: OtpType
) {
  const codeHash = hashOtp(code);

  const otpRecord = await prisma.otpVerification.findFirst({
    where: {
      identifier,
      codeHash,
      type,
      consumedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!otpRecord) {
    throw new AppError("Invalid or expired OTP code.", 400, "INVALID_OTP");
  }

  // Consume OTP
  await prisma.otpVerification.update({
    where: { id: otpRecord.id },
    data: { consumedAt: new Date() },
  });

  // If email verification, activate user
  if (type === OtpType.EMAIL_VERIFICATION) {
    const isEmail = identifier.includes("@");
    if (isEmail) {
      await prisma.user.updateMany({
        where: { email: identifier.toLowerCase().trim() },
        data: { isVerified: true },
      });
    } else {
      await prisma.user.updateMany({
        where: { phone: identifier.trim() },
        data: { isVerified: true },
      });
    }
  }

  return {
    success: true,
    message: "OTP verified successfully.",
    isVerified: true,
  };
}

/**
 * Initiates forgot-password workflow with reset token and OTP.
 */
export async function forgotPassword(email: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  // Prevent email enumeration attack by always returning success
  if (!user) {
    return {
      success: true,
      message:
        "If an account exists with this email, a password reset link and OTP has been sent.",
    };
  }

  const resetToken = generateSecureToken(32);
  const tokenHash = hashToken(resetToken);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  const otp = generateOtp();
  const otpHash = hashOtp(otp);

  await prisma.$transaction([
    prisma.passwordResetToken.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: new Date() },
    }),
    prisma.otpVerification.updateMany({
      where: {
        identifier: user.email,
        type: OtpType.PASSWORD_RESET,
        consumedAt: null,
      },
      data: { consumedAt: new Date() },
    }),
    prisma.passwordResetToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt,
      },
    }),
    prisma.otpVerification.create({
      data: {
        identifier: user.email,
        userId: user.id,
        codeHash: otpHash,
        type: OtpType.PASSWORD_RESET,
        expiresAt,
      },
    }),
  ]);

  await sendPasswordResetEmail(user.email, user.name, resetToken, otp);

  return {
    success: true,
    message:
      "If an account exists with this email, a password reset link and OTP has been sent.",
  };
}

/**
 * Resets user password using single-use reset token or OTP.
 */
export async function resetPassword(data: ResetPasswordInput) {
  const user = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase().trim() },
  });

  if (!user) {
    throw new AppError(
      "Invalid password reset request.",
      400,
      "INVALID_RESET_REQUEST"
    );
  }

  let isValid = false;

  // 1. Check if token matches standard reset token
  const tokenHash = hashToken(data.token);
  const resetRecord = await prisma.passwordResetToken.findFirst({
    where: {
      userId: user.id,
      tokenHash,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
  });

  if (resetRecord) {
    isValid = true;
    await prisma.passwordResetToken.update({
      where: { id: resetRecord.id },
      data: { usedAt: new Date() },
    });
  } else {
    // 2. Check if token is a 6-digit OTP
    const otpHash = hashOtp(data.token);
    const otpRecord = await prisma.otpVerification.findFirst({
      where: {
        identifier: user.email,
        codeHash: otpHash,
        type: OtpType.PASSWORD_RESET,
        consumedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (otpRecord) {
      isValid = true;
      await prisma.otpVerification.update({
        where: { id: otpRecord.id },
        data: { consumedAt: new Date() },
      });
    }
  }

  if (!isValid) {
    throw new AppError(
      "Invalid or expired password reset token / OTP.",
      400,
      "INVALID_RESET_TOKEN"
    );
  }

  // Hash new password and invalidate all active sessions
  const newPasswordHash = await hashPassword(data.newPassword);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash },
    }),
    prisma.refreshToken.updateMany({
      where: { userId: user.id, revokedAt: null },
      data: { revokedAt: new Date() },
    }),
  ]);

  return {
    success: true,
    message:
      "Password reset successful. You may now login with your new password.",
  };
}

/**
 * Retrieves the current authenticated user profile.
 */
export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
      farmerProfile: true,
    },
  });

  if (!user) {
    throw new AppError("User not found.", 404, "USER_NOT_FOUND");
  }

  return user;
}
