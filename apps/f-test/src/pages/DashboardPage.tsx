import React, { useState, useEffect } from "react";
import {
  User,
  ShieldCheck,
  Sprout,
  Store,
  Layers,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Check,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../components/ui/button.js";
import { Badge } from "../components/ui/badge.js";
import { Input } from "../components/ui/input.js";
import { Label } from "../components/ui/label.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card.js";
import { Alert, AlertDescription } from "../components/ui/alert.js";
import { TokenState } from "../interfaces/index.js";
import { executeApiRequest } from "../services/apiClient.js";

interface DashboardPageProps {
  tokenState: TokenState;
  onLogout: () => void;
  onTokenUpdate: (accessToken: string, refreshToken?: string, role?: string, email?: string, userId?: string) => void;
}

export function DashboardPage({ tokenState, onLogout, onTokenUpdate }: DashboardPageProps): React.JSX.Element {
  const [profile, setProfile] = useState<any>(null);
  const [farmerProfile, setFarmerProfile] = useState<any>(null);
  const [roleData, setRoleData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Edit Form State
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    village: "",
    taluka: "",
    district: "",
    state: "",
    pincode: "",
    landSizeAcres: "",
    mainCrops: "",
    secondaryCrops: "",
    irrigationType: "",
    farmLocation: "",
  });

  const fetchProfileAndDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Auth Profile
      const meRes = await executeApiRequest({
        method: "GET",
        endpoint: "/api/v1/auth/me",
        token: tokenState.accessToken,
      });

      if (!meRes.ok) {
        const errData = meRes.data as any;
        setError(errData?.message || "Session expired. Please sign in again.");
        return;
      }

      const meData = (meRes.data as any)?.data || meRes.data;
      setProfile(meData);

      const userRole = meData?.user?.role || tokenState.role;

      // 2. Fetch Farmer Profile if role is FARMER
      if (userRole === "FARMER") {
        const fpRes = await executeApiRequest({
          method: "GET",
          endpoint: "/api/v1/farmer/profile",
          token: tokenState.accessToken,
        });

        if (fpRes.ok) {
          const fpData = (fpRes.data as any)?.data;
          setFarmerProfile(fpData);
          const fp = fpData?.farmerProfile || {};
          setEditForm({
            name: fpData?.name || "",
            phone: fpData?.phone || "",
            addressLine1: fp?.addressLine1 || "",
            addressLine2: fp?.addressLine2 || "",
            village: fp?.village || "",
            taluka: fp?.taluka || "",
            district: fp?.district || "",
            state: fp?.state || "",
            pincode: fp?.pincode || "",
            landSizeAcres: fp?.landSizeAcres ? String(fp.landSizeAcres) : "",
            mainCrops: Array.isArray(fp?.mainCrops) ? fp.mainCrops.join(", ") : "",
            secondaryCrops: Array.isArray(fp?.secondaryCrops) ? fp.secondaryCrops.join(", ") : "",
            irrigationType: fp?.irrigationType || "",
            farmLocation: fp?.farmLocation || "",
          });
        }

        const farmerRes = await executeApiRequest({
          method: "GET",
          endpoint: "/api/v1/farmer/dashboard",
          token: tokenState.accessToken,
        });
        if (farmerRes.ok) setRoleData((farmerRes.data as any)?.data);
      } else if (userRole === "MANDI_OPERATOR") {
        const mandiRes = await executeApiRequest({
          method: "GET",
          endpoint: "/api/v1/mandi/dashboard",
          token: tokenState.accessToken,
        });
        if (mandiRes.ok) setRoleData((mandiRes.data as any)?.data);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setError(null);
    try {
      const payload = {
        name: editForm.name.trim(),
        phone: editForm.phone.trim() || undefined,
        addressLine1: editForm.addressLine1.trim() || undefined,
        addressLine2: editForm.addressLine2.trim() || undefined,
        village: editForm.village.trim() || undefined,
        taluka: editForm.taluka.trim() || undefined,
        district: editForm.district.trim() || undefined,
        state: editForm.state.trim() || undefined,
        pincode: editForm.pincode.trim() || undefined,
        landSizeAcres: editForm.landSizeAcres ? parseFloat(editForm.landSizeAcres) : undefined,
        mainCrops: editForm.mainCrops.split(",").map((c) => c.trim()).filter(Boolean),
        secondaryCrops: editForm.secondaryCrops.split(",").map((c) => c.trim()).filter(Boolean),
        irrigationType: editForm.irrigationType.trim() || undefined,
        farmLocation: editForm.farmLocation.trim() || undefined,
      };

      const res = await executeApiRequest({
        method: "PUT",
        endpoint: "/api/v1/farmer/profile",
        token: tokenState.accessToken,
        body: payload,
      });

      if (!res.ok) {
        const errData = res.data as any;
        if (errData?.errors && Array.isArray(errData.errors)) {
          setError(errData.errors.map((e: any) => `${e.field}: ${e.message}`).join(", "));
        } else {
          setError(errData?.message || "Failed to update profile.");
        }
        return;
      }

      const updated = (res.data as any)?.data;
      setFarmerProfile(updated);
      setEditingProfile(false);
      setStatusMessage("Farmer profile and address updated successfully!");
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred while saving profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleRefreshToken = async () => {
    if (!tokenState.refreshToken) {
      setError("No refresh token stored.");
      return;
    }

    setRefreshing(true);
    try {
      const res = await executeApiRequest({
        method: "POST",
        endpoint: "/api/v1/auth/refresh",
        body: { refreshToken: tokenState.refreshToken },
      });

      if (res.ok) {
        const data = res.data as any;
        const newAccessToken = data.data?.accessToken || data.accessToken;
        if (newAccessToken) {
          onTokenUpdate(newAccessToken, tokenState.refreshToken);
          setStatusMessage("Access token refreshed successfully!");
          setTimeout(() => setStatusMessage(null), 3000);
        }
      } else {
        setError("Token refresh failed. Please log in again.");
      }
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfileAndDashboard();
  }, [tokenState.accessToken]);

  const user = profile?.user || farmerProfile || {
    name: "Farmer User",
    email: tokenState.email || "user@example.com",
    role: tokenState.role || "FARMER",
    phone: null,
  };

  const fp = farmerProfile?.farmerProfile || {};

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Welcome back, {user.name || user.fullName || "Farmer"}
          </h1>
          <p className="text-sm text-slate-500">
            Connected to KrishiSetu Backend microservices
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshToken}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? "animate-spin" : ""}`} />
            Refresh Session
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onLogout}
          >
            Sign Out
          </Button>
        </div>
      </div>

      {statusMessage && (
        <Alert variant="success">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{statusMessage}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 text-slate-500">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mb-2" />
          <p className="text-sm">Loading your profile and dashboard...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between text-slate-900">
                <span className="flex items-center gap-2">
                  <User className="h-5 w-5 text-emerald-600" />
                  Farmer Profile
                </span>
                {tokenState.role === "FARMER" && !editingProfile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingProfile(true)}
                    className="text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                  >
                    <Edit3 className="h-3.5 w-3.5 mr-1" />
                    Edit Info
                  </Button>
                )}
              </CardTitle>
              <CardDescription>Verified personal and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Full Name</span>
                <span className="font-medium text-slate-900">{farmerProfile?.name || user.name || "—"}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Role</span>
                <Badge variant="emerald">{user.role || tokenState.role}</Badge>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-400" /> Email
                </span>
                <span className="font-medium font-mono text-xs text-slate-800">{user.email}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-slate-400" /> Phone
                </span>
                <span className="font-medium text-slate-800">{farmerProfile?.phone || user.phone || "Not set"}</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Status
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Active</span>
              </div>
            </CardContent>
          </Card>

          {/* Right Column: Edit Profile Form or Address & Crops Overview */}
          <div className="md:col-span-2 space-y-6">
            {editingProfile ? (
              <Card className="border-emerald-200 shadow-sm bg-white ring-1 ring-emerald-500/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between text-slate-900">
                    <span className="flex items-center gap-2">
                      <Edit3 className="h-5 w-5 text-emerald-600" />
                      Edit Farmer Info & Detailed Address
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingProfile(false)}
                      className="text-xs"
                    >
                      Cancel
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Update your name, full address with pincode, and agricultural crop records
                  </CardDescription>
                </CardHeader>

                <form onSubmit={handleSaveProfile}>
                  <CardContent className="space-y-4">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="name">Farmer Name</Label>
                        <Input
                          id="name"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          placeholder="9876543210"
                        />
                      </div>
                    </div>

                    {/* Address Section */}
                    <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 space-y-3">
                      <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-emerald-600" /> Detailed Address & Pincode
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="addr1" className="text-xs">Address Line 1 / Street</Label>
                          <Input
                            id="addr1"
                            className="text-xs bg-white"
                            placeholder="e.g. Plot No. 12, Kisan Nagar"
                            value={editForm.addressLine1}
                            onChange={(e) => setEditForm({ ...editForm, addressLine1: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="village" className="text-xs">Village / Town</Label>
                          <Input
                            id="village"
                            className="text-xs bg-white"
                            placeholder="e.g. Lasalgaon"
                            value={editForm.village}
                            onChange={(e) => setEditForm({ ...editForm, village: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="taluka" className="text-xs">Taluka / Sub-district</Label>
                          <Input
                            id="taluka"
                            className="text-xs bg-white"
                            placeholder="e.g. Niphad"
                            value={editForm.taluka}
                            onChange={(e) => setEditForm({ ...editForm, taluka: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="district" className="text-xs">District</Label>
                          <Input
                            id="district"
                            className="text-xs bg-white"
                            placeholder="e.g. Nashik"
                            value={editForm.district}
                            onChange={(e) => setEditForm({ ...editForm, district: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="state" className="text-xs">State</Label>
                          <Input
                            id="state"
                            className="text-xs bg-white"
                            placeholder="e.g. Maharashtra"
                            value={editForm.state}
                            onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-1 sm:w-1/3">
                        <Label htmlFor="pincode" className="text-xs font-semibold">Pincode (6 digits)</Label>
                        <Input
                          id="pincode"
                          className="text-xs bg-white font-mono"
                          placeholder="422306"
                          maxLength={6}
                          value={editForm.pincode}
                          onChange={(e) => setEditForm({ ...editForm, pincode: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Agricultural Details */}
                    <div className="p-3.5 rounded-lg border border-emerald-100 bg-emerald-50/40 space-y-3">
                      <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                        <Sprout className="h-3.5 w-3.5" /> Farm & Crop Profile
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="mainCrops" className="text-xs">Main Crops (comma-separated)</Label>
                          <Input
                            id="mainCrops"
                            className="text-xs bg-white"
                            placeholder="e.g. Onion, Tomato, Wheat"
                            value={editForm.mainCrops}
                            onChange={(e) => setEditForm({ ...editForm, mainCrops: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="secCrops" className="text-xs">Secondary Crops</Label>
                          <Input
                            id="secCrops"
                            className="text-xs bg-white"
                            placeholder="e.g. Soybean, Gram"
                            value={editForm.secondaryCrops}
                            onChange={(e) => setEditForm({ ...editForm, secondaryCrops: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="landSize" className="text-xs">Total Land Size (Acres)</Label>
                          <Input
                            id="landSize"
                            type="number"
                            step="0.1"
                            className="text-xs bg-white"
                            placeholder="5.5"
                            value={editForm.landSizeAcres}
                            onChange={(e) => setEditForm({ ...editForm, landSizeAcres: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="irrigation" className="text-xs">Irrigation Type</Label>
                          <Input
                            id="irrigation"
                            className="text-xs bg-white"
                            placeholder="e.g. Drip Irrigation, Well"
                            value={editForm.irrigationType}
                            onChange={(e) => setEditForm({ ...editForm, irrigationType: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditingProfile(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-xs"
                        disabled={savingProfile}
                      >
                        {savingProfile ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-1" />
                            Save Profile Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </form>
              </Card>
            ) : (
              <>
                {/* Farmer Detailed Address & Crops Card */}
                {tokenState.role === "FARMER" && (
                  <Card className="border-slate-200 shadow-sm bg-white">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-between text-slate-900">
                        <span className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-emerald-600" />
                          Address & Crop Details
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingProfile(true)}
                          className="text-xs"
                        >
                          <Edit3 className="h-3.5 w-3.5 mr-1" />
                          Update Address & Crops
                        </Button>
                      </CardTitle>
                      <CardDescription>
                        Detailed registered location, pincode, and agricultural produce
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3.5 space-y-1.5 text-sm">
                          <div className="text-xs font-semibold text-slate-600">Registered Farm Address</div>
                          <div className="font-medium text-slate-900">
                            {fp.addressLine1 ? `${fp.addressLine1}, ` : ""}
                            {fp.village ? `Village ${fp.village}, ` : ""}
                            {fp.taluka ? `Taluka ${fp.taluka}, ` : ""}
                            {fp.district ? `Dist. ${fp.district}, ` : ""}
                            {fp.state ? `${fp.state} ` : ""}
                            {fp.pincode ? <span className="font-mono font-bold text-emerald-700">- {fp.pincode}</span> : ""}
                            {!fp.addressLine1 && !fp.village && !fp.district && (
                              <span className="text-slate-400 italic">No detailed address added yet. Click &quot;Update Address & Crops&quot; above.</span>
                            )}
                          </div>
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3.5 space-y-1.5 text-sm">
                          <div className="text-xs font-semibold text-slate-600">Land & Irrigation</div>
                          <div className="text-slate-900">
                            <strong>Land Size:</strong> {fp.landSizeAcres ? `${fp.landSizeAcres} Acres` : "Not specified"}
                          </div>
                          <div className="text-slate-900">
                            <strong>Irrigation:</strong> {fp.irrigationType || "Not specified"}
                          </div>
                        </div>
                      </div>

                      <div className="rounded-lg border border-emerald-100 bg-emerald-50/40 p-3.5 space-y-2">
                        <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                          <Sprout className="h-3.5 w-3.5" /> Main Cultivated Crops
                        </div>
                        {Array.isArray(fp.mainCrops) && fp.mainCrops.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {fp.mainCrops.map((c: string, i: number) => (
                              <span
                                key={i}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500 italic">No crops recorded yet.</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Role Specific Module Panel */}
                <Card className="border-slate-200 shadow-sm bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
                      {tokenState.role === "FARMER" ? (
                        <Sprout className="h-5 w-5 text-emerald-600" />
                      ) : tokenState.role === "MANDI_OPERATOR" ? (
                        <Store className="h-5 w-5 text-amber-600" />
                      ) : (
                        <Layers className="h-5 w-5 text-blue-600" />
                      )}
                      {tokenState.role === "FARMER"
                        ? "Farmer Dashboard Modules"
                        : tokenState.role === "MANDI_OPERATOR"
                        ? "Mandi Yard Modules"
                        : "Platform Services"}
                    </CardTitle>
                    <CardDescription>
                      Live RBAC-protected service modules returned from backend
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {roleData?.modules ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {roleData.modules.map((mod: string, idx: number) => (
                          <div
                            key={idx}
                            className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all shadow-2xs"
                          >
                            <div className="font-semibold text-sm text-slate-900 mb-1">
                              {mod}
                            </div>
                            <div className="text-xs text-slate-500">
                              Operational & synced with SIH microservice
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                        <Layers className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                        <p className="font-medium text-slate-700">Welcome to your portal dashboard.</p>
                        <p className="text-xs text-slate-400 mt-1">Browse market listings, orders, and services.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
