import { Request, Response, NextFunction } from "express";
import { getFarmerProfile, updateFarmerProfile } from "../services/farmer.service.js";
import { updateFarmerProfileSchema } from "../schemas/farmer.schema.js";

/**
 * Controller to get current authenticated farmer profile: GET /api/v1/farmer/profile
 */
export async function getFarmerProfileHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const profile = await getFarmerProfile(userId);

    res.status(200).json({
      success: true,
      message: "Farmer profile retrieved successfully.",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Controller to update farmer profile and address: PUT/PATCH /api/v1/farmer/profile
 */
export async function updateFarmerProfileHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const validatedData = updateFarmerProfileSchema.parse(req.body);
    const updatedProfile = await updateFarmerProfile(userId, validatedData);

    res.status(200).json({
      success: true,
      message: "Farmer profile updated successfully.",
      data: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
}
