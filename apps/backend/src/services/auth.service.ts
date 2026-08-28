import { prisma } from "../lib/prisma.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import {
  generateAccessToken,
  generateRefreshTokenString,
  hashToken,
} from "../utils/jwt.js";
import { generateOtp, generateSecureToken, hashOtp } from "../utils/otp.js";
import { emailService } from "./email.service.js";
import { AppError } from "../middlewares/errorHandler.middleware.js";
import {
  RegisterInput,
  LoginInput,
  ResetPasswordInput,
} from "../schemas/auth.schema.js";
import { OtpType, Role } from "@prisma/client";

export class AuthService {
  /**
   * Registers a new user (Farmer, Mandi Operator, or Admin).
   */
  async register(data: RegisterInput) {
    // 1. Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingEmail) {
      throw new AppError("An account with this email address already exists.", 409, "EMAIL_EXISTS");
    }

    // 2. Check if phone already exists if provided
    if (data.phone) {
      const existingPhone = await prisma.user.findUnique({
        where: { phone: data.phone },
      });

      if (existingPhone) {
        throw new AppError("An account with this phone number already exists.", 409, "PHONE_EXISTS");
      }
    }

    // 3. Hash password
    const passwordHash = await hashPassword(data.password);

    // 4. Create user record
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

    // Send email asynchronously (non-blocking for registration flow)
    emailService.sendVerificationOtpEmail(user.email, user.name, otp).catch((err) => {
      console.error("Failed to send verification email:", err);
    });

    // 6. Generate tokens
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
   * Authenticates user using email or phone with password.
   */
  async login(data: LoginInput) {
    const isEmail = data.identifier.includes("@");

    const user = isEmail
      ? await prisma.user.findUnique({ where: { email: data.identifier.toLowerCase().trim() } })
      : await prisma.user.findUnique({ where: { phone: data.identifier.trim() } });

    if (!user) {
      throw new AppError("Invalid email/phone or password.", 401, "INVALID_CREDENTIALS");
    }

    const isMatch = await comparePassword(data.password, user.passwordHash);
    if (!isMatch) {
      throw new AppError("Invalid email/phone or password.", 401, "INVALID_CREDENTIALS");
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
   * Refreshes access token with Refresh Token rotation & reuse detection.
   */
  async refreshAccessToken(refreshTokenRaw: string) {
    const tokenHash = hashToken(refreshTokenRaw);

    const storedToken = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!storedToken) {
      throw new AppError("Invalid refresh token.", 401, "INVALID_REFRESH_TOKEN");
    }

    // Reuse detection: If token was already revoked, someone may have stolen it
    if (storedToken.revokedAt) {
      // Invalidate all tokens for this user for security
      await prisma.refreshToken.updateMany({
        where: { userId: storedToken.userId },
        data: { revokedAt: new Date() },
      });
      throw new AppError(
        "Refresh token has already been used or revoked. All active sessions invalidated for security.",
        401,
        "TOKEN_REUSE_DETECTED"
      );
    }

    // Expiry check
    if (storedToken.expiresAt < new Date()) {
      throw new AppError("Refresh token has expired. Please log in again.", 401, "REFRESH_TOKEN_EXPIRED");
    }

    // Generate new tokens
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

    // Rotate token: revoke old token and link to new one
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
   * Logs out user by revoking the refresh token.
   */
  async logout(refreshTokenRaw?: string) {
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
   * Sends or resends an OTP for verification or password reset.
   */
  async sendOtp(identifier: string, type: OtpType) {
    const isEmail = identifier.includes("@");
    const user = isEmail
      ? await prisma.user.findUnique({ where: { email: identifier.toLowerCase().trim() } })
      : await prisma.user.findUnique({ where: { phone: identifier.trim() } });

    // Invalidate existing active OTPs for this identifier and type
    await prisma.otpVerification.updateMany({
      where: {
        identifier,
        type,
        consumedAt: null,
      },
      data: {
        consumedAt: new Date(),
      },
    });

    const otp = generateOtp();
    const otpHash = hashOtp(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

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
        await emailService.sendVerificationOtpEmail(user.email, user.name, otp);
      } else if (type === OtpType.PASSWORD_RESET) {
        await emailService.sendPasswordResetEmail(user.email, user.name, otp, otp);
      }
    }

    return {
      success: true,
      message: `OTP sent successfully to ${identifier}. Valid for 10 minutes.`,
    };
  }

  /**
   * Verifies an OTP code.
   */
  async verifyOtp(identifier: string, code: string, type: OtpType) {
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

    // Mark OTP as consumed
    await prisma.otpVerification.update({
      where: { id: otpRecord.id },
      data: { consumedAt: new Date() },
    });

    // If it's email verification, mark user as verified
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
   * Initiates forgot-password workflow by generating a single-use token and OTP.
   */
  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // To prevent email enumeration attacks, always respond with a success message
    if (!user) {
      return {
        success: true,
        message: "If an account exists with this email, a password reset link and OTP has been sent.",
      };
    }

    const resetToken = generateSecureToken(32);
    const tokenHash = hashToken(resetToken);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const otp = generateOtp();
    const otpHash = hashOtp(otp);

    await prisma.$transaction([
      // Invalidate existing reset tokens for user
      prisma.passwordResetToken.updateMany({
        where: { userId: user.id, usedAt: null },
        data: { usedAt: new Date() },
      }),
      // Invalidate existing password reset OTPs
      prisma.otpVerification.updateMany({
        where: { identifier: user.email, type: OtpType.PASSWORD_RESET, consumedAt: null },
        data: { consumedAt: new Date() },
      }),
      // Create new reset token
      prisma.passwordResetToken.create({
        data: {
          tokenHash,
          userId: user.id,
          expiresAt,
        },
      }),
      // Create new reset OTP
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

    await emailService.sendPasswordResetEmail(user.email, user.name, resetToken, otp);

    return {
      success: true,
      message: "If an account exists with this email, a password reset link and OTP has been sent.",
    };
  }

  /**
   * Resets password using a single-use token or OTP.
   */
  async resetPassword(data: ResetPasswordInput) {
    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase().trim() },
    });

    if (!user) {
      throw new AppError("Invalid password reset request.", 400, "INVALID_RESET_REQUEST");
    }

    let isValid = false;

    // Check if token matches standard 64-char hex reset token
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
      // Check if provided token is a 6-digit OTP
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
      throw new AppError("Invalid or expired password reset token / OTP.", 400, "INVALID_RESET_TOKEN");
    }

    // Hash new password
    const newPasswordHash = await hashPassword(data.newPassword);

    // Update password and invalidate all active user sessions/refresh tokens for security
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
      message: "Password reset successful. You may now login with your new password.",
    };
  }

  /**
   * Fetches current authenticated user profile.
   */
  async getCurrentUser(userId: string) {
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
      },
    });

    if (!user) {
      throw new AppError("User not found.", 404, "USER_NOT_FOUND");
    }

    return user;
  }
}

export const authService = new AuthService();
