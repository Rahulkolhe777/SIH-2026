import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.js";
import { DecodedToken } from "../interfaces/index.js";
import { prisma, Role } from "@repo/database";

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken & { id: string };
    }
  }
}

/**
 * Middleware to authenticate requests via Bearer JWT access token.
 */
export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Authentication required. Please provide a valid Bearer token.",
      code: "UNAUTHORIZED",
    });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({
      success: false,
      message: "Authentication token missing.",
      code: "UNAUTHORIZED",
    });
    return;
  }

  const decoded = verifyAccessToken(token);
  if (!decoded) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired access token. Please refresh your token or login again.",
      code: "TOKEN_EXPIRED_OR_INVALID",
    });
    return;
  }

  // Attach decoded user payload to request
  req.user = {
    ...decoded,
    id: decoded.userId,
  };

  next();
}

/**
 * Middleware to enforce Role-Based Access Control (RBAC).
 * Must be used after authenticate middleware.
 */
export function requireRole(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
        code: "UNAUTHORIZED",
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden. Access restricted to roles: [${allowedRoles.join(", ")}]. Current role: ${req.user.role}`,
        code: "FORBIDDEN_ROLE",
      });
      return;
    }

    next();
  };
}

/**
 * Middleware to ensure the authenticated user's account is verified.
 */
export function requireVerified(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Authentication required.",
      code: "UNAUTHORIZED",
    });
    return;
  }

  if (!req.user.isVerified) {
    res.status(403).json({
      success: false,
      message: "Account verification required to access this resource.",
      code: "ACCOUNT_NOT_VERIFIED",
    });
    return;
  }

  next();
}
