# Farmer Module — Frontend API Integration

## 1. Overview
The Farmer Frontend integration connects `apps/frontend` to the protected farmer endpoints in `apps/backend/src/routes/farmer.routes.ts`.

---

## 2. API Endpoints

| Endpoint | Method | Redux Action / Thunk | Description |
|---|:---:|---|---|
| `/api/v1/farmer/profile` | `GET` | `fetchFarmerProfileThunk()` | Retrieves full profile with land size, crops, and address |
| `/api/v1/farmer/profile` | `PUT` | `updateFarmerProfileThunk(payload)` | Updates farmer personal info, address with pincode, and crops |
| `/api/v1/farmer/dashboard` | `GET` | `apiGetFarmerDashboard()` | Fetches farmer dashboard modules and access metadata |

---

## 3. Redux Store (`farmerSlice`)
- **State**: `profile: FarmerFullProfile | null`, `isLoading`, `isUpdating`, `error`, `successMessage`.
- **Location**: `apps/frontend/src/store/slices/farmerSlice.ts`
- **Interfaces**: Defined in `apps/frontend/src/interfaces/farmer.interface.ts` and barrel-exported via `src/interfaces/index.ts`.
