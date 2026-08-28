import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service.js";
import { roleRegisterSchema } from "../schemas/auth.schema.js";
import { Role } from "@prisma/client";

export class UserController {
  /**
   * Dedicated registration endpoint for Farmers: POST /api/v1/user/farmer
   */
  async registerFarmer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = roleRegisterSchema.parse(req.body);
      const result = await authService.register({
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
  async registerMandi(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = roleRegisterSchema.parse(req.body);
      const result = await authService.register({
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
}

export const userController = new UserController();
