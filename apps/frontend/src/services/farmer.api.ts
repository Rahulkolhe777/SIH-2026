import { apiClient } from "./apiClient";
import type {
  ApiResponse,
  FarmerFullProfile,
  UpdateFarmerProfilePayload,
} from "../interfaces";

/**
 * Fetch complete farmer profile including farm location, land size, and crops.
 */
export async function apiGetFarmerProfile(): Promise<ApiResponse<FarmerFullProfile>> {
  const response = await apiClient.get<ApiResponse<FarmerFullProfile>>("/api/v1/farmer/profile");
  return response.data;
}

/**
 * Update farmer profile, address with pincode, and agricultural details.
 */
export async function apiUpdateFarmerProfile(
  payload: UpdateFarmerProfilePayload
): Promise<ApiResponse<FarmerFullProfile>> {
  const response = await apiClient.put<ApiResponse<FarmerFullProfile>>("/api/v1/farmer/profile", payload);
  return response.data;
}

/**
 * Fetch farmer dashboard metadata and active modules.
 */
export async function apiGetFarmerDashboard(): Promise<ApiResponse<any>> {
  const response = await apiClient.get<ApiResponse<any>>("/api/v1/farmer/dashboard");
  return response.data;
}
