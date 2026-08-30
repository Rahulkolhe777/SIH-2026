import React, { useState, useEffect } from "react";
import { X, User, Phone, MapPin, Sprout, Check, Save, Sparkles, ShieldCheck } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store";
import { updateFarmerProfileThunk, clearFarmerMessages } from "../../store/slices/farmerSlice";

interface FarmerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const availableCrops = [
  "Sharbati Wheat",
  "Basmati Rice",
  "Soybean",
  "Mustard",
  "Maize",
  "Gram / Chana",
  "Cotton",
  "Groundnut",
];

const irrigationOptions = ["Drip Irrigation", "Sprinkler System", "Canal / River", "Tube Well / Borewell", "Rainfed"];

export function FarmerProfileModal({ isOpen, onClose }: FarmerProfileModalProps) {
  const dispatch = useAppDispatch();
  const { profile, isUpdating, error, successMessage } = useAppSelector((state) => state.farmer);
  const authUser = useAppSelector((state) => state.auth.user);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [village, setVillage] = useState("");
  const [taluka, setTaluka] = useState("");
  const [district, setDistrict] = useState("");
  const [stateName, setStateName] = useState("Madhya Pradesh");
  const [pincode, setPincode] = useState("");
  const [landSizeAcres, setLandSizeAcres] = useState<number | "">("");
  const [selectedMainCrops, setSelectedMainCrops] = useState<string[]>([]);
  const [irrigationType, setIrrigationType] = useState("Drip Irrigation");

  useEffect(() => {
    if (profile || authUser) {
      setName(profile?.name || authUser?.name || "");
      setPhone(profile?.phone || authUser?.phone || "");
      const fp = profile?.farmerProfile;
      if (fp) {
        setVillage(fp.village || "");
        setTaluka(fp.taluka || "");
        setDistrict(fp.district || "");
        setStateName(fp.state || "Madhya Pradesh");
        setPincode(fp.pincode || "");
        setLandSizeAcres(fp.landSizeAcres ?? "");
        setSelectedMainCrops(fp.mainCrops || ["Sharbati Wheat", "Soybean"]);
        setIrrigationType(fp.irrigationType || "Drip Irrigation");
      }
    }
  }, [profile, authUser, isOpen]);

  if (!isOpen) return null;

  const toggleCrop = (crop: string) => {
    if (selectedMainCrops.includes(crop)) {
      setSelectedMainCrops(selectedMainCrops.filter((c) => c !== crop));
    } else {
      setSelectedMainCrops([...selectedMainCrops, crop]);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearFarmerMessages());

    await dispatch(
      updateFarmerProfileThunk({
        name: name.trim(),
        phone: phone.trim() || undefined,
        village: village.trim() || undefined,
        taluka: taluka.trim() || undefined,
        district: district.trim() || undefined,
        state: stateName.trim() || undefined,
        pincode: pincode.trim() || undefined,
        landSizeAcres: typeof landSizeAcres === "number" ? landSizeAcres : undefined,
        mainCrops: selectedMainCrops,
        irrigationType,
      })
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-[32px] border border-[#E5E8EB] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative text-left selection:bg-[#C8F52F] selection:text-[#0B2D1B]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F0F2F5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#111315] text-[#C8F52F] flex items-center justify-center shadow-md">
              <Sprout size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#111315]">Farmer & Land Profile</h2>
              <p className="text-xs text-[#6C727F]">Sync with Government APMC Land Registry</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F5F7F8] hover:bg-[#E8EAEC] flex items-center justify-center text-[#6C727F] hover:text-[#111315] transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="mt-4 p-3 rounded-2xl text-xs font-medium bg-red-50 border border-red-200 text-red-700">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mt-4 p-3 rounded-2xl text-xs font-medium bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-5 pt-4">
          {/* Section 1: Personal Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#8A92A0] uppercase tracking-wider">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[#6C727F] mb-1 block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-[#8A92A0]" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-[#F8F9FA] border border-[#E2E5E9] focus:border-[#111315] rounded-xl text-xs text-[#111315] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#6C727F] mb-1 block">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-[#8A92A0]" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full pl-10 pr-3 py-2.5 bg-[#F8F9FA] border border-[#E2E5E9] focus:border-[#111315] rounded-xl text-xs text-[#111315] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Farm Location & Address */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#8A92A0] uppercase tracking-wider">
              Farm Location & APMC Territory
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-[#6C727F] mb-1 block">Village / Town</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="e.g. Sanwer"
                  className="w-full px-3 py-2.5 bg-[#F8F9FA] border border-[#E2E5E9] focus:border-[#111315] rounded-xl text-xs text-[#111315] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#6C727F] mb-1 block">Tehsil / Taluka</label>
                <input
                  type="text"
                  value={taluka}
                  onChange={(e) => setTaluka(e.target.value)}
                  placeholder="e.g. Sanwer Tehsil"
                  className="w-full px-3 py-2.5 bg-[#F8F9FA] border border-[#E2E5E9] focus:border-[#111315] rounded-xl text-xs text-[#111315] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#6C727F] mb-1 block">District</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. Indore"
                  className="w-full px-3 py-2.5 bg-[#F8F9FA] border border-[#E2E5E9] focus:border-[#111315] rounded-xl text-xs text-[#111315] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[#6C727F] mb-1 block">State</label>
                <input
                  type="text"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  placeholder="Madhya Pradesh"
                  className="w-full px-3 py-2.5 bg-[#F8F9FA] border border-[#E2E5E9] focus:border-[#111315] rounded-xl text-xs text-[#111315] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#6C727F] mb-1 block">Pincode</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="453551"
                  className="w-full px-3 py-2.5 bg-[#F8F9FA] border border-[#E2E5E9] focus:border-[#111315] rounded-xl text-xs text-[#111315] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Agricultural Holdings & Crops */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#8A92A0] uppercase tracking-wider">
              Agricultural Holdings & Cultivated Crops
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[#6C727F] mb-1 block">Total Land Area (Acres)</label>
                <input
                  type="number"
                  step="0.1"
                  value={landSizeAcres}
                  onChange={(e) => setLandSizeAcres(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="e.g. 12.5"
                  className="w-full px-3 py-2.5 bg-[#F8F9FA] border border-[#E2E5E9] focus:border-[#111315] rounded-xl text-xs text-[#111315] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#6C727F] mb-1 block">Irrigation System</label>
                <select
                  value={irrigationType}
                  onChange={(e) => setIrrigationType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#F8F9FA] border border-[#E2E5E9] focus:border-[#111315] rounded-xl text-xs text-[#111315] focus:outline-none cursor-pointer"
                >
                  {irrigationOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-[#6C727F] mb-1.5 block">
                Primary Cultivated Crops (Click to select)
              </label>
              <div className="flex flex-wrap gap-2">
                {availableCrops.map((crop) => {
                  const isSelected = selectedMainCrops.includes(crop);
                  return (
                    <button
                      type="button"
                      key={crop}
                      onClick={() => toggleCrop(crop)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-[#111315] text-[#C8F52F] shadow-sm"
                          : "bg-[#F0F2F5] text-[#6C727F] hover:bg-[#E8EAED]"
                      }`}
                    >
                      {isSelected && <Check size={12} strokeWidth={3} />}
                      <span>{crop}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#F0F2F5] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#6C727F] hover:bg-[#F5F7F8] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-6 py-2.5 rounded-full bg-[#111315] hover:bg-black text-white text-xs font-semibold flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isUpdating ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={14} className="text-[#C8F52F]" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
