import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public details?: any;

  constructor(message: string, statusCode: number = 400, code: string = "BAD_REQUEST", details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));

    res.status(400).json({
      success: false,
      message: "Validation failed on request data.",
      code: "VALIDATION_ERROR",
      errors: formattedErrors,
    });
    return;
  }

  // Handle Custom Application Errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
      details: err.details,
    });
    return;
  }

  // Handle Prisma Known Request Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const target = (err.meta?.target as string[]) || ["field"];
      res.status(409).json({
        success: false,
        message: `An account with this ${target.join(", ")} already exists.`,
        code: "RESOURCE_ALREADY_EXISTS",
      });
      return;
    }

    if (err.code === "P2025") {
      res.status(404).json({
        success: false,
        message: "Record not found.",
        code: "NOT_FOUND",
      });
      return;
    }
  }

  // Catch-all Internal Server Error
  console.error("💥 Unhandled Error:", err);
  res.status(500).json({
    success: false,
    message: "An internal server error occurred. Please try again later.",
    code: "INTERNAL_SERVER_ERROR",
  });
}
