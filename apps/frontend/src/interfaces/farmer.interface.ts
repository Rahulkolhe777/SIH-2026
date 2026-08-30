export interface FarmerProfileData {
  id?: string;
  userId?: string;
  addressLine1?: string | null;
  addressLine2?: string | null;
  village?: string | null;
  taluka?: string | null;
  district?: string | null;
  state?: string | null;
  pincode?: string | null;
  landSizeAcres?: number | null;
  mainCrops?: string[];
  secondaryCrops?: string[];
  irrigationType?: string | null;
  farmLocation?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface FarmerFullProfile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
  farmerProfile?: FarmerProfileData | null;
}

export interface UpdateFarmerProfilePayload {
  name?: string;
  phone?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  village?: string | null;
  taluka?: string | null;
  district?: string | null;
  state?: string | null;
  pincode?: string | null;
  landSizeAcres?: number | null;
  mainCrops?: string[];
  secondaryCrops?: string[];
  irrigationType?: string | null;
  farmLocation?: string | null;
}
