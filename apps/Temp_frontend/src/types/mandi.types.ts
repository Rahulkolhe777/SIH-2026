export type Role = "FARMER" | "MANDI_OPERATOR" | "ADMIN";

export type MandiApprovalStatus =
  | "PENDING_ONBOARDING"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "REQUIRES_DOCUMENTS";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: Role;
  isVerified: boolean;
  mandiName?: string;
  mandiCode?: string;
  location?: string;
  district?: string;
  state?: string;
  approvalStatus?: MandiApprovalStatus;
  rating?: number;
  totalRatingsCount?: number;
  avatarUrl?: string;
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

export type BookingStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "ARRIVED"
  | "VERIFIED"
  | "COMPLETED"
  | "CANCELLED";

export interface Booking {
  id: string;
  token: string;
  farmerName: string;
  farmerPhone: string;
  farmerId: string;
  crop: string;
  variety?: string;
  quantityQuintals: number;
  capacityPercentage: number;
  slotId: string;
  slotTime: string;
  slotDate: string;
  vehicleNumber?: string;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
  verifiedAt?: string;
  completedAt?: string;
}

export interface MandiSlot {
  id: string;
  crop: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  totalCapacityQuintals: number;
  bookedCapacityQuintals: number;
  capacityPercentage: number;
  maxFarmers: number;
  bookedFarmers: number;
  availableBookings: number;
  bufferMinutes: number;
  bufferPercentage: number;
  isActive: boolean;
}

export interface MandiProfile {
  id?: string;
  name: string;
  mandiName: string;
  apmcCode: string;
  email: string;
  phone: string;
  address: string;
  district: string;
  state: string;
  operatingHours: string;
  aadhaarNumber?: string;
  aadhaarVerified: boolean;
  aadhaarDocName?: string;
  approvalStatus: MandiApprovalStatus;
  rejectionReason?: string | null;
  approvedAt?: string | null;
  rating: number;
  totalReviews: number;
  legalDocs: {
    id: string;
    name: string;
    type: "MANDI_LICENSE" | "APMC_REGISTRATION" | "GST_CERTIFICATE" | "OTHER";
    status: "VERIFIED" | "PENDING" | "REJECTED";
    uploadedAt: string;
    fileUrl?: string;
  }[];
  avatarUrl?: string;
}

export interface OnboardingPayload {
  mandiName: string;
  apmcCode: string;
  address: string;
  district: string;
  state: string;
  operatingHours?: string;
  aadhaarNumber: string;
  aadhaarDocUrl?: string;
  legalDocs?: {
    name: string;
    type: "MANDI_LICENSE" | "APMC_REGISTRATION" | "GST_CERTIFICATE" | "OTHER";
    fileUrl?: string;
  }[];
}

export interface DashboardMetrics {
  totalSlotsToday: number;
  activeBookings: number;
  arrivalsToday: number;
  completedToday: number;
  pendingApprovals: number;
  totalCapacityUtilizedPercentage: number;
}
