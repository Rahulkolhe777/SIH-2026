import { prisma } from "../lib/prisma.js";
import { AppError } from "../middlewares/errorHandler.middleware.js";
import {
  UpdateFarmerProfileInput,
  FarmerFullProfileResponse,
} from "../interfaces/index.js";

/**
 * Retrieves the authenticated farmer's full profile including address and crop details.
 */
export async function getFarmerProfile(userId: string): Promise<FarmerFullProfileResponse> {
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
    throw new AppError("Farmer account not found.", 404, "USER_NOT_FOUND");
  }

  // If farmerProfile doesn't exist yet, create an initial one
  if (!user.farmerProfile) {
    const newProfile = await prisma.farmerProfile.create({
      data: {
        userId: user.id,
        mainCrops: [],
        secondaryCrops: [],
      },
    });

    return {
      ...user,
      farmerProfile: newProfile,
    };
  }

  return user;
}

/**
 * Updates a farmer's personal information, detailed address, and agricultural crop details.
 */
export async function updateFarmerProfile(
  userId: string,
  input: UpdateFarmerProfileInput
): Promise<FarmerFullProfileResponse> {
  // 1. Verify user exists
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    throw new AppError("Farmer account not found.", 404, "USER_NOT_FOUND");
  }

  // 2. Check if phone is being changed and if it already exists for another user
  if (input.phone && input.phone !== existingUser.phone) {
    const existingPhone = await prisma.user.findUnique({
      where: { phone: input.phone },
    });

    if (existingPhone && existingPhone.id !== userId) {
      throw new AppError(
        "This phone number is already linked to another account.",
        409,
        "PHONE_EXISTS"
      );
    }
  }

  // 3. Prepare User fields to update
  const userUpdateData: { name?: string; phone?: string | null } = {};
  if (input.name !== undefined) {
    userUpdateData.name = input.name.trim();
  }
  if (input.phone !== undefined) {
    userUpdateData.phone = input.phone.trim() === "" ? null : input.phone.trim();
  }

  // 4. Prepare FarmerProfile fields to upsert
  const profileUpsertData: Record<string, unknown> = {};

  if (input.addressLine1 !== undefined) profileUpsertData.addressLine1 = input.addressLine1?.trim() || null;
  if (input.addressLine2 !== undefined) profileUpsertData.addressLine2 = input.addressLine2?.trim() || null;
  if (input.village !== undefined) profileUpsertData.village = input.village?.trim() || null;
  if (input.taluka !== undefined) profileUpsertData.taluka = input.taluka?.trim() || null;
  if (input.district !== undefined) profileUpsertData.district = input.district?.trim() || null;
  if (input.state !== undefined) profileUpsertData.state = input.state?.trim() || null;
  if (input.pincode !== undefined) profileUpsertData.pincode = input.pincode?.trim() || null;
  if (input.landSizeAcres !== undefined) profileUpsertData.landSizeAcres = input.landSizeAcres;
  if (input.mainCrops !== undefined) {
    profileUpsertData.mainCrops = input.mainCrops.map((c) => c.trim()).filter(Boolean);
  }
  if (input.secondaryCrops !== undefined) {
    profileUpsertData.secondaryCrops = input.secondaryCrops.map((c) => c.trim()).filter(Boolean);
  }
  if (input.irrigationType !== undefined) profileUpsertData.irrigationType = input.irrigationType?.trim() || null;
  if (input.farmLocation !== undefined) profileUpsertData.farmLocation = input.farmLocation?.trim() || null;

  // 5. Execute transaction to update User and upsert FarmerProfile
  const [updatedUser] = await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: userUpdateData,
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
    }),
    prisma.farmerProfile.upsert({
      where: { userId },
      create: {
        userId,
        ...profileUpsertData,
      },
      update: profileUpsertData,
    }),
  ]);

  // 6. Return refreshed complete profile
  const fullProfile = await prisma.farmerProfile.findUnique({
    where: { userId },
  });

  return {
    ...updatedUser,
    farmerProfile: fullProfile,
  };
}
