import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { hashPassword } from "../src/utils/password.js";
import { generateAccessToken, hashToken } from "../src/utils/jwt.js";
import { hashOtp } from "../src/utils/otp.js";
import { Role, OtpType } from "@prisma/client";

// Mock Prisma
vi.mock("../src/lib/prisma.js", () => {
  const mockPrisma = {
    user: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    refreshToken: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    otpVerification: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    passwordResetToken: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    $transaction: vi.fn((callbacks) => {
      if (Array.isArray(callbacks)) {
        return Promise.all(callbacks);
      }
      if (typeof callbacks === "function") {
        return callbacks(mockPrisma);
      }
      return Promise.resolve();
    }),
  };

  return {
    prisma: mockPrisma,
    default: mockPrisma,
  };
});

describe("Authentication & Registration Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/v1/auth/register", () => {
    it("should successfully register a Farmer", async () => {
      const mockCreatedUser = {
        id: "user-farmer-123",
        name: "Ramesh Farmer",
        email: "ramesh@farmer.com",
        phone: "+919876543210",
        passwordHash: "hashedpassword",
        role: Role.FARMER,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.user.create).mockResolvedValue(mockCreatedUser);
      vi.mocked(prisma.otpVerification.create).mockResolvedValue({} as any);
      vi.mocked(prisma.refreshToken.create).mockResolvedValue({} as any);

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "Ramesh Farmer",
          email: "ramesh@farmer.com",
          phone: "+919876543210",
          password: "SecurePassword123",
          role: "FARMER",
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.role).toBe("FARMER");
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
      expect(prisma.user.create).toHaveBeenCalledTimes(1);
    });

    it("should successfully register a Mandi Operator", async () => {
      const mockCreatedUser = {
        id: "user-mandi-456",
        name: "Suresh Mandi",
        email: "suresh@mandi.com",
        phone: "+919876543211",
        passwordHash: "hashedpassword",
        role: Role.MANDI_OPERATOR,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.user.create).mockResolvedValue(mockCreatedUser);
      vi.mocked(prisma.otpVerification.create).mockResolvedValue({} as any);
      vi.mocked(prisma.refreshToken.create).mockResolvedValue({} as any);

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "Suresh Mandi",
          email: "suresh@mandi.com",
          phone: "+919876543211",
          password: "SecurePassword123",
          role: "MANDI_OPERATOR",
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.role).toBe("MANDI_OPERATOR");
    });

    it("should reject registration if email already exists (409)", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "existing-1",
        email: "ramesh@farmer.com",
      } as any);

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "Ramesh Farmer",
          email: "ramesh@farmer.com",
          password: "SecurePassword123",
          role: "FARMER",
        });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe("EMAIL_EXISTS");
    });

    it("should reject invalid registration data (400 validation error)", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "A", // too short
          email: "not-an-email",
          password: "weak", // too short, no numbers
        });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe("VALIDATION_ERROR");
      expect(response.body.errors).toBeDefined();
    });
  });

  describe("POST /api/v1/user/farmer and /api/v1/user/mandi", () => {
    it("should register a farmer via dedicated endpoint", async () => {
      const mockCreatedUser = {
        id: "farmer-1",
        name: "Kisan Bhai",
        email: "kisan@farmer.com",
        phone: null,
        passwordHash: "hash",
        role: Role.FARMER,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.user.create).mockResolvedValue(mockCreatedUser);
      vi.mocked(prisma.otpVerification.create).mockResolvedValue({} as any);
      vi.mocked(prisma.refreshToken.create).mockResolvedValue({} as any);

      const response = await request(app)
        .post("/api/v1/user/farmer")
        .send({
          name: "Kisan Bhai",
          email: "kisan@farmer.com",
          password: "StrongPassword123",
        });

      expect(response.status).toBe(201);
      expect(response.body.data.user.role).toBe("FARMER");
    });

    it("should register a mandi operator via dedicated endpoint", async () => {
      const mockCreatedUser = {
        id: "mandi-1",
        name: "APMC Operator",
        email: "apmc@mandi.gov.in",
        phone: null,
        passwordHash: "hash",
        role: Role.MANDI_OPERATOR,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.user.create).mockResolvedValue(mockCreatedUser);
      vi.mocked(prisma.otpVerification.create).mockResolvedValue({} as any);
      vi.mocked(prisma.refreshToken.create).mockResolvedValue({} as any);

      const response = await request(app)
        .post("/api/v1/user/mandi")
        .send({
          name: "APMC Operator",
          email: "apmc@mandi.gov.in",
          password: "StrongPassword123",
        });

      expect(response.status).toBe(201);
      expect(response.body.data.user.role).toBe("MANDI_OPERATOR");
    });
  });

  describe("POST /api/v1/auth/login", () => {
    it("should successfully log in with valid email & password", async () => {
      const rawPassword = "ValidPassword123";
      const hashedPassword = await hashPassword(rawPassword);

      const mockUser = {
        id: "user-1",
        name: "Test User",
        email: "test@user.com",
        phone: null,
        passwordHash: hashedPassword,
        role: Role.FARMER,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(prisma.refreshToken.create).mockResolvedValue({} as any);

      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          identifier: "test@user.com",
          password: rawPassword,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe("test@user.com");
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it("should reject login with wrong password (401)", async () => {
      const hashedPassword = await hashPassword("CorrectPassword123");

      const mockUser = {
        id: "user-1",
        name: "Test User",
        email: "test@user.com",
        phone: null,
        passwordHash: hashedPassword,
        role: Role.FARMER,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          identifier: "test@user.com",
          password: "WrongPassword999",
        });

      expect(response.status).toBe(401);
      expect(response.body.code).toBe("INVALID_CREDENTIALS");
    });

    it("should reject login for non-existent user (401)", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          identifier: "unknown@user.com",
          password: "AnyPassword123",
        });

      expect(response.status).toBe(401);
      expect(response.body.code).toBe("INVALID_CREDENTIALS");
    });

    it("should reject login for unverified account (403 ACCOUNT_NOT_VERIFIED)", async () => {
      const rawPassword = "ValidPassword123";
      const hashedPassword = await hashPassword(rawPassword);

      const mockUnverifiedUser = {
        id: "user-unverified",
        name: "Unverified User",
        email: "unverified@user.com",
        phone: null,
        passwordHash: hashedPassword,
        role: Role.FARMER,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUnverifiedUser);

      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          identifier: "unverified@user.com",
          password: rawPassword,
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe("ACCOUNT_NOT_VERIFIED");
    });
  });

  describe("POST /api/v1/auth/refresh", () => {
    it("should rotate and return new tokens with valid refresh token", async () => {
      const mockUser = {
        id: "user-123",
        name: "Test",
        email: "test@example.com",
        role: Role.FARMER,
        isVerified: true,
      };

      const mockToken = {
        id: "token-1",
        tokenHash: hashToken("raw-refresh-token"),
        userId: "user-123",
        expiresAt: new Date(Date.now() + 1000000),
        revokedAt: null,
        user: mockUser,
      };

      vi.mocked(prisma.refreshToken.findUnique).mockResolvedValue(mockToken as any);
      vi.mocked(prisma.refreshToken.update).mockResolvedValue({} as any);
      vi.mocked(prisma.refreshToken.create).mockResolvedValue({} as any);

      const response = await request(app)
        .post("/api/v1/auth/refresh")
        .send({ refreshToken: "raw-refresh-token" });

      expect(response.status).toBe(200);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it("should detect reuse if refresh token is already revoked and reject with 401", async () => {
      const mockToken = {
        id: "token-revoked",
        tokenHash: hashToken("stolen-token"),
        userId: "user-123",
        expiresAt: new Date(Date.now() + 1000000),
        revokedAt: new Date(), // Already revoked!
        user: { id: "user-123" },
      };

      vi.mocked(prisma.refreshToken.findUnique).mockResolvedValue(mockToken as any);

      const response = await request(app)
        .post("/api/v1/auth/refresh")
        .send({ refreshToken: "stolen-token" });

      expect(response.status).toBe(401);
      expect(response.body.code).toBe("TOKEN_REUSE_DETECTED");
      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { userId: "user-123" },
        data: { revokedAt: expect.any(Date) },
      });
    });
  });

  describe("OTP and Account Verification", () => {
    it("should verify email OTP and mark account verified", async () => {
      const rawOtp = "123456";
      const hashedOtp = hashOtp(rawOtp);

      const mockOtpRecord = {
        id: "otp-1",
        identifier: "farmer@test.com",
        codeHash: hashedOtp,
        type: OtpType.EMAIL_VERIFICATION,
        consumedAt: null,
        expiresAt: new Date(Date.now() + 100000),
      };

      vi.mocked(prisma.otpVerification.findFirst).mockResolvedValue(mockOtpRecord as any);
      vi.mocked(prisma.otpVerification.update).mockResolvedValue({} as any);
      vi.mocked(prisma.user.updateMany).mockResolvedValue({ count: 1 });

      const response = await request(app)
        .post("/api/v1/auth/verify-otp")
        .send({
          identifier: "farmer@test.com",
          code: "123456",
          type: "EMAIL_VERIFICATION",
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.isVerified).toBe(true);
      expect(prisma.user.updateMany).toHaveBeenCalledWith({
        where: { email: "farmer@test.com" },
        data: { isVerified: true },
      });
    });

    it("should reject invalid OTP (400)", async () => {
      vi.mocked(prisma.otpVerification.findFirst).mockResolvedValue(null);

      const response = await request(app)
        .post("/api/v1/auth/verify-otp")
        .send({
          identifier: "farmer@test.com",
          code: "999999",
          type: "EMAIL_VERIFICATION",
        });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe("INVALID_OTP");
    });
  });

  describe("Password Recovery & Reset", () => {
    it("should accept forgot-password request and return safe message", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "user-1",
        name: "John",
        email: "john@test.com",
      } as any);

      vi.mocked(prisma.passwordResetToken.create).mockResolvedValue({} as any);
      vi.mocked(prisma.otpVerification.create).mockResolvedValue({} as any);

      const response = await request(app)
        .post("/api/v1/auth/forgot-password")
        .send({ email: "john@test.com" });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it("should reset password with valid token and invalidate previous sessions", async () => {
      const mockUser = {
        id: "user-1",
        email: "john@test.com",
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);
      vi.mocked(prisma.passwordResetToken.findFirst).mockResolvedValue({
        id: "reset-1",
        userId: "user-1",
        usedAt: null,
        expiresAt: new Date(Date.now() + 100000),
      } as any);

      vi.mocked(prisma.passwordResetToken.update).mockResolvedValue({} as any);
      vi.mocked(prisma.user.update).mockResolvedValue({} as any);
      vi.mocked(prisma.refreshToken.updateMany).mockResolvedValue({ count: 2 });

      const response = await request(app)
        .post("/api/v1/auth/reset-password")
        .send({
          email: "john@test.com",
          token: "valid-reset-token-hex",
          newPassword: "NewStrongPassword123",
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { userId: "user-1", revokedAt: null },
        data: { revokedAt: expect.any(Date) },
      });
    });
  });
});
