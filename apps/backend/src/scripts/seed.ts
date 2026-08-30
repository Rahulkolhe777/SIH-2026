import { prisma } from "../lib/prisma.js";
import { Role, MandiApprovalStatus, LegalDocType } from "@prisma/client";
import { hashPassword } from "../utils/password.js";

async function main() {
  console.log("🌱 Cleaning and seeding test accounts into PostgreSQL...");

  const testEmails = [
    "mandi.approved@agrimarket.gov.in",
    "mandi.pending@agrimarket.gov.in",
    "mandi.new@agrimarket.gov.in",
    "admin@agrimarket.gov.in",
    "new.mandi@agrimarket.gov.in",
  ];

  await prisma.user.deleteMany({
    where: { email: { in: testEmails } },
  });

  const passwordHash = await hashPassword("Password@123");

  // ----------------------------------------------------
  // 1. APPROVED MANDI OPERATOR (Full operational access)
  // ----------------------------------------------------
  const approvedUser = await prisma.user.create({
    data: {
      name: "Rupesh Sharma",
      email: "mandi.approved@agrimarket.gov.in",
      phone: "+919826012345",
      passwordHash,
      role: Role.MANDI_OPERATOR,
      isVerified: true,
    },
  });

  const approvedProfile = await prisma.mandiProfile.create({
    data: {
      userId: approvedUser.id,
      mandiName: "Indore APMC Central Grain Yard",
      apmcCode: "APMC-IND-MP-042",
      address: "Plot No. 44, Industrial Area, Bypass Highway",
      district: "Indore",
      state: "Madhya Pradesh",
      operatingHours: "07:30 AM - 06:00 PM (Mon-Sat)",
      aadhaarNumber: "5412 8901 2345",
      aadhaarVerified: true,
      approvalStatus: MandiApprovalStatus.APPROVED,
      approvedAt: new Date(),
      rating: 4.8,
      totalReviews: 142,
    },
  });

  // Seed sample slots for approved mandi
  const todayStr = new Date().toISOString().split("T")[0] || "2026-08-30";
  await prisma.mandiSlot.createMany({
    data: [
      {
        mandiProfileId: approvedProfile.id,
        crop: "Wheat (Sharbati)",
        date: todayStr,
        startTime: "08:00",
        endTime: "11:30",
        totalCapacityQuintals: 500,
        bookedCapacityQuintals: 245,
        capacityPercentage: 49.0,
        maxFarmers: 20,
        bookedFarmers: 6,
        availableBookings: 14,
        bufferMinutes: 15,
        bufferPercentage: 10,
        isActive: true,
      },
      {
        mandiProfileId: approvedProfile.id,
        crop: "Mustard (Sarson)",
        date: todayStr,
        startTime: "12:00",
        endTime: "15:30",
        totalCapacityQuintals: 400,
        bookedCapacityQuintals: 160,
        capacityPercentage: 40.0,
        maxFarmers: 16,
        bookedFarmers: 4,
        availableBookings: 12,
        bufferMinutes: 20,
        bufferPercentage: 10,
        isActive: true,
      },
    ],
  });

  // ----------------------------------------------------
  // 2. PENDING APPROVAL MANDI (Submitted KYC, awaiting admin approval)
  // ----------------------------------------------------
  const pendingUser = await prisma.user.create({
    data: {
      name: "Vikram Patel",
      email: "mandi.pending@agrimarket.gov.in",
      phone: "+919876543211",
      passwordHash,
      role: Role.MANDI_OPERATOR,
      isVerified: true,
    },
  });

  const pendingProfile = await prisma.mandiProfile.create({
    data: {
      userId: pendingUser.id,
      mandiName: "Ujjain Krishi Upaj Mandi Yard",
      apmcCode: "APMC-UJJ-MP-019",
      address: "Agar Rd, Industrial Area",
      district: "Ujjain",
      state: "Madhya Pradesh",
      operatingHours: "08:00 AM - 06:00 PM (Mon-Sat)",
      aadhaarNumber: "8912 3456 7890",
      aadhaarVerified: true,
      approvalStatus: MandiApprovalStatus.PENDING_APPROVAL,
    },
  });

  await prisma.mandiLegalDoc.createMany({
    data: [
      {
        mandiProfileId: pendingProfile.id,
        name: "Ujjain APMC Mandi License 2026",
        type: LegalDocType.MANDI_LICENSE,
        status: "PENDING",
        fileUrl: "https://vault.agrimarket.gov.in/docs/ujjain_license.pdf",
      },
      {
        mandiProfileId: pendingProfile.id,
        name: "MP State Mandi Board Registration",
        type: LegalDocType.APMC_REGISTRATION,
        status: "PENDING",
        fileUrl: "https://vault.agrimarket.gov.in/docs/ujjain_board_reg.pdf",
      },
    ],
  });

  // ----------------------------------------------------
  // 3. FRESH / UN-ONBOARDED MANDI (Needs to fill KYC in Settings)
  // ----------------------------------------------------
  const newUser = await prisma.user.create({
    data: {
      name: "Amit Deshmukh",
      email: "mandi.new@agrimarket.gov.in",
      phone: "+919811122233",
      passwordHash,
      role: Role.MANDI_OPERATOR,
      isVerified: true,
    },
  });

  await prisma.mandiProfile.create({
    data: {
      userId: newUser.id,
      mandiName: null,
      apmcCode: null,
      address: null,
      district: null,
      state: null,
      aadhaarNumber: null,
      aadhaarVerified: false,
      approvalStatus: MandiApprovalStatus.PENDING_ONBOARDING,
    },
  });

  // ----------------------------------------------------
  // 4. PLATFORM ADMINISTRATOR (Can verify and approve)
  // ----------------------------------------------------
  await prisma.user.create({
    data: {
      name: "Platform Administrator",
      email: "admin@agrimarket.gov.in",
      phone: "+919999900000",
      passwordHash,
      role: Role.ADMIN,
      isVerified: true,
    },
  });

  console.log("✅ All test accounts seeded into PostgreSQL successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
