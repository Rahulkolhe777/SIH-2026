import { Request, Response, NextFunction } from "express";
import { registerUser } from "../services/auth.service.js";
import { roleRegisterSchema } from "../schemas/auth.schema.js";
import { Role } from "@prisma/client";

/**
 * Dedicated registration endpoint for Farmers: POST /api/v1/user/farmer
 */
export async function registerFarmer(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validatedData = roleRegisterSchema.parse(req.body);
    const result = await registerUser({
      ...validatedData,
      role: Role.FARMER,
    });

    res.status(201).json({
      success: true,
      message: "Farmer account registered successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Dedicated registration endpoint for Mandi Operators: POST /api/v1/user/mandi
 */
export async function registerMandi(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validatedData = roleRegisterSchema.parse(req.body);
    const result = await registerUser({
      ...validatedData,
      role: Role.MANDI_OPERATOR,
    });

    res.status(201).json({
      success: true,
      message: "Mandi Operator account registered successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
