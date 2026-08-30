import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {
  FarmerFullProfile,
  UpdateFarmerProfilePayload,
} from "../../interfaces";
import {
  apiGetFarmerProfile,
  apiUpdateFarmerProfile,
} from "../../services/farmer.api";

export interface FarmerState {
  profile: FarmerFullProfile | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: FarmerState = {
  profile: null,
  isLoading: false,
  isUpdating: false,
  error: null,
  successMessage: null,
};

export const fetchFarmerProfileThunk = createAsyncThunk(
  "farmer/fetchProfile",
  async (_, { rejectWithValue }) => {
    const response = await apiGetFarmerProfile();
    if (!response.success || !response.data) {
      return rejectWithValue(
        response.error?.message || response.message || "Failed to load farmer profile."
      );
    }
    return response.data;
  }
);

export const updateFarmerProfileThunk = createAsyncThunk(
  "farmer/updateProfile",
  async (payload: UpdateFarmerProfilePayload, { rejectWithValue }) => {
    const response = await apiUpdateFarmerProfile(payload);
    if (!response.success || !response.data) {
      return rejectWithValue(
        response.error?.message || response.message || "Failed to update farmer profile."
      );
    }
    return response.data;
  }
);

export const farmerSlice = createSlice({
  name: "farmer",
  initialState,
  reducers: {
    clearFarmerMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Profile
    builder
      .addCase(fetchFarmerProfileThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFarmerProfileThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchFarmerProfileThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to fetch profile.";
      });

    // Update Profile
    builder
      .addCase(updateFarmerProfileThunk.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateFarmerProfileThunk.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.profile = action.payload;
        state.successMessage = "Profile updated successfully.";
      })
      .addCase(updateFarmerProfileThunk.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = (action.payload as string) || "Failed to update profile.";
      });
  },
});

export const { clearFarmerMessages } = farmerSlice.actions;
export default farmerSlice.reducer;
