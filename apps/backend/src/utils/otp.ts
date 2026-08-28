import crypto from "crypto";

/**
 * Generates a crypto-secure 6-digit numeric OTP.
 */
export function generateOtp(): string {
  // Generates integer between 100000 and 999999
  return crypto.randomInt(100000, 1000000).toString();
}

/**
 * Generates a secure random URL-safe token (e.g. for password resets or email verification links).
 */
export function generateSecureToken(bytes: number = 32): string {
  return crypto.randomBytes(bytes).toString("hex");
}

/**
 * Hashes an OTP or token using SHA-256 for secure database storage.
 */
export function hashOtp(otp: string): string {
  return crypto.createHash("sha256").update(otp).digest("hex");
}
