import React, { memo } from "react";
import { Plus, X, ArrowRight } from "lucide-react";

interface CreateBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  newMandi: string;
  setNewMandi: (val: string) => void;
  newCrop: string;
  setNewCrop: (val: string) => void;
  newQuantityKg: string;
  setNewQuantityKg: (val: string) => void;
  newTruck: string;
  setNewTruck: (val: string) => void;
  newDate: string;
  setNewDate: (val: string) => void;
}

export const CreateBookingModal = memo(function CreateBookingModal({
  isOpen,
  onClose,
  onSubmit,
  newMandi,
  setNewMandi,
  newCrop,
  setNewCrop,
  newQuantityKg,
  setNewQuantityKg,
  newTruck,
  setNewTruck,
  newDate,
  setNewDate,
}: CreateBookingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-[#E8EAEC] p-6 sm:p-7 shadow-2xl space-y-5 text-left relative">
        <div className="flex items-center justify-between border-b border-[#F1F3F5] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0B2D1B] text-[#C8F52F] flex items-center justify-center font-bold">
              <Plus size={16} strokeWidth={3} />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#0B2D1B]">Book Mandi Unloading Slot</h3>
              <span className="text-xs text-[#5A6C5F]">
                Generate instant gate token and skip physical waiting lines
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-[#8A92A0] hover:text-[#0B2D1B] hover:bg-[#F4F4F2] cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Select Mandi */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#0B2D1B]">Select Destination Mandi</label>
            <select
              value={newMandi}
              onChange={(e) => setNewMandi(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F8F9FA] border border-[#E2E5E9] rounded-xl text-xs font-semibold text-[#0B2D1B] focus:outline-none focus:border-[#0B2D1B]"
            >
              <option value="Indore APMC Central Grain Yard">
                Indore APMC Central Grain Yard (4.8 km • 8 slots left)
              </option>
              <option value="Ujjain Grain Mandi">Ujjain Grain Mandi (14.2 km • 5 slots left)</option>
              <option value="Dewas APMC Terminal">Dewas APMC Terminal (18.6 km • 12 slots left)</option>
              <option value="Dhar District Grain Mandi">
                Dhar District Grain Mandi (28.0 km • 9 slots left)
              </option>
            </select>
          </div>

          {/* Select Crop */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#0B2D1B]">Crop Type</label>
            <select
              value={newCrop}
              onChange={(e) => setNewCrop(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F8F9FA] border border-[#E2E5E9] rounded-xl text-xs font-semibold text-[#0B2D1B] focus:outline-none focus:border-[#0B2D1B]"
            >
              <option value="Wheat (Sharbati Gold)">Wheat (Sharbati Gold) • ₹2,425/Qtl</option>
              <option value="Soybean (Yellow JS-9560)">Soybean (Yellow JS-9560) • ₹4,890/Qtl</option>
              <option value="Rice (Basmati 1121)">Rice (Basmati 1121) • ₹3,850/Qtl</option>
              <option value="Mustard (Sarson Bold)">Mustard (Sarson Bold) • ₹5,650/Qtl</option>
              <option value="Gram / Chana (Desi)">Gram / Chana (Desi) • ₹5,800/Qtl</option>
            </select>
          </div>

          {/* Quantity in KG */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#0B2D1B]">Produce Quantity (KG)</label>
              <input
                type="number"
                required
                min={100}
                step={100}
                value={newQuantityKg}
                onChange={(e) => setNewQuantityKg(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F8F9FA] border border-[#E2E5E9] rounded-xl text-xs font-bold text-[#0B2D1B] focus:outline-none focus:border-[#0B2D1B]"
              />
              <span className="text-[10px] text-[#5A6C5F]">
                ≈ {(Number(newQuantityKg) / 100).toFixed(1)} Quintals
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#0B2D1B]">Vehicle Number</label>
              <input
                type="text"
                required
                value={newTruck}
                onChange={(e) => setNewTruck(e.target.value)}
                placeholder="MP-09-AB-1234"
                className="w-full px-3.5 py-2.5 bg-[#F8F9FA] border border-[#E2E5E9] rounded-xl text-xs font-mono font-bold text-[#0B2D1B] uppercase focus:outline-none focus:border-[#0B2D1B]"
              />
              <span className="text-[10px] text-[#5A6C5F]">Tractor / Truck / Pickup</span>
            </div>
          </div>

          {/* Slot Time */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#0B2D1B]">
              Arrival Date & Time Window
            </label>
            <select
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F8F9FA] border border-[#E2E5E9] rounded-xl text-xs font-semibold text-[#0B2D1B] focus:outline-none focus:border-[#0B2D1B]"
            >
              <option value="Today • 03:00 PM - 04:30 PM">
                Today (31 Aug) • 03:00 PM - 04:30 PM (Optimal)
              </option>
              <option value="Today • 04:30 PM - 06:00 PM">Today (31 Aug) • 04:30 PM - 06:00 PM</option>
              <option value="Tomorrow • 08:30 AM - 10:00 AM">
                Tomorrow (01 Sep) • 08:30 AM - 10:00 AM (Early Intake)
              </option>
              <option value="Tomorrow • 10:30 AM - 12:00 PM">
                Tomorrow (01 Sep) • 10:30 AM - 12:00 PM
              </option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-[#0B2D1B] hover:bg-[#06180E] text-[#C8F52F] rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <span>Confirm Slot & Generate QR Token</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});
