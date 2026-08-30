export interface UpdateFarmerProfileInput {
  name?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  village?: string;
  taluka?: string;
  district?: string;
  state?: string;
  pincode?: string;
  landSizeAcres?: number | null;
  mainCrops?: string[];
  secondaryCrops?: string[];
  irrigationType?: string;
  farmLocation?: string;
}

export interface FarmerProfileData {
  id: string;
  userId: string;
  addressLine1: string | null;
  addressLine2: string | null;
  village: string | null;
  taluka: string | null;
  district: string | null;
  state: string | null;
  pincode: string | null;
  landSizeAcres: number | null;
  mainCrops: string[];
  secondaryCrops: string[];
  irrigationType: string | null;
  farmLocation: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface FarmerFullProfileResponse {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  isVerified: boolean;
  farmerProfile: FarmerProfileData | null;
  createdAt: Date;
  updatedAt: Date;
}
