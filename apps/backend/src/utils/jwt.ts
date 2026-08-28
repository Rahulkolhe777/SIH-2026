import jwt from "jsonwebtoken";
import crypto from "crypto";
import { env } from "../config/env.js";
import { TokenPayload, DecodedToken } from "../interfaces/index.js";

export type { TokenPayload, DecodedToken };

/**
 * Generates a short-lived access token JWT.
 */
export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as any,
  });
}

/**
 * Generates an opaque crypto-secure refresh token string.
 */
export function generateRefreshTokenString(): string {
  return crypto.randomBytes(40).toString("hex");
}

/**
 * Hashes a refresh token or opaque token with SHA-256 for secure database storage.
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Verifies an access token JWT.
 */
export function verifyAccessToken(token: string): DecodedToken | null {
  try {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as DecodedToken;
  } catch {
    return null;
  }
}
