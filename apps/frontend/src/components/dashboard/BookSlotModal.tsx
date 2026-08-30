import React, { useState } from "react";
import { X, Calendar, Clock, Truck, QrCode, CheckCircle2, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

interface BookSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSlotBooked?: (slotData: any) => void;
}

const mandiYards = [
  "Indore APMC Yard #01 (Grain Market)",
  "Ujjain Krishi Mandi (Yard 02)",
  "Dewas Main Mandi Gate",
  "Dhar Agricultural Yard",
];

const cropOptions = [
  "Sharbati Wheat (Grade A)",
  "Basmati Rice 1121",
  "Yellow Soybean",
  "Mustard Seed",
  "Desi Gram / Chana",
];

const availableTimeSlots = [
  "08:00 AM - 09:30 AM (Morning Fast Entry)",
  "10:00 AM - 11:30 AM (Peak Intake)",
  "12:00 PM - 01:30 PM (Midday Dock)",
  "02:30 PM - 04:00 PM (Afternoon Bulk)",
];

export function BookSlotModal({ isOpen, onClose, onSlotBooked }: BookSlotModalProps) {
  const [selectedMandi, setSelectedMandi] = useState(mandiYards[0]);
  const [selectedCrop, setSelectedCrop] = useState(cropOptions[0]);
  const [quantityQtl, setQuantityQtl] = useState(120);
  const [vehicleNo, setVehicleNo] = useState("MP-09-AB-4821");
  const [slotDate, setSlotDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [selectedSlotTime, setSelectedSlotTime] = useState(availableTimeSlots[1]);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<any>(null);

  if (!isOpen) return null;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const token = {
      tokenId: `APMC-${Math.floor(1000 + Math.random() * 9000)}`,
      mandi: selectedMandi,
      crop: selectedCrop,
      quantity: `${quantityQtl} Qtl`,
      vehicle: vehicleNo.toUpperCase(),
      date: slotDate,
      time: selectedSlotTime,
      bay: "Bay 03 (Fast Intake)",
      status: "CONFIRMED",
    };
    setGeneratedToken(token);
    setBookingSuccess(true);
    if (onSlotBooked) onSlotBooked(token);
  };

  const handleReset = () => {
    setBookingSuccess(false);
    setGeneratedToken(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-[32px] border border-[#E5E8EB] shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative text-left selection:bg-[#C8F52F] selection:text-[#0B2D1B]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F0F2F5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#111315] text-[#C8F52F] flex items-center justify-center shadow-md">
              <Calendar size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#111315]">Book Mandi Unloading Slot</h2>
              <p className="text-xs text-[#6C727F]">Instant Digital Gate Entry Token & Weighbridge Pass</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="w-8 h-8 rounded-full bg-[#F5F7F8] hover:bg-[#E8EAEC] flex items-center justify-center text-[#6C727F] hover:text-[#111315] transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {bookingSuccess && generatedToken ? (
          /* Success Screen with Gate Token QR */
          <div className="py-6 space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 size={32} />
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#111315]">Slot Confirmed!</h3>
              <p className="text-xs text-[#6C727F] mt-1">Your APMC Gate Entry Pass is ready</p>
            </div>

            {/* Pass Preview Card */}
            <div className="p-5 bg-[#F8F9FA] rounded-2xl border border-[#E2E5E9] text-left space-y-3 font-sans">
              <div className="flex items-center justify-between border-b border-[#E8EAEC] pb-2.5">
                <span className="font-mono text-sm font-bold text-[#111315]">{generatedToken.tokenId}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  {generatedToken.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[#8A92A0] block text-[10px] uppercase">Yard & Gate</span>
                  <span className="font-semibold text-[#111315]">{generatedToken.mandi}</span>
                </div>
                <div>
                  <span className="text-[#8A92A0] block text-[10px] uppercase">Assigned Bay</span>
                  <span className="font-semibold text-[#111315]">{generatedToken.bay}</span>
                </div>
                <div>
                  <span className="text-[#8A92A0] block text-[10px] uppercase">Commodity</span>
                  <span className="font-semibold text-[#111315]">{generatedToken.crop} ({generatedToken.quantity})</span>
                </div>
                <div>
                  <span className="text-[#8A92A0] block text-[10px] uppercase">Vehicle No.</span>
                  <span className="font-semibold text-[#111315]">{generatedToken.vehicle}</span>
                </div>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-[#E2E5E9] flex items-center justify-between text-xs">
                <span className="text-[#6C727F]">Arrival Slot:</span>
                <span className="font-bold text-[#111315]">{generatedToken.date} • {generatedToken.time}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="w-full py-3 rounded-full bg-[#111315] hover:bg-black text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              Done & View on Dashboard
            </button>
          </div>
        ) : (
          /* Slot Booking Form */
          <form onSubmit={handleBookingSubmit} className="space-y-4 pt-4">
            <div>
              <label className="text-xs font-medium text-[#6C727F] mb-1 block">Select Mandi Yard</label>
              <select
                value={selectedMandi}
                onChange={(e) => setSelectedMandi(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F8F9FA] border border-[#E2E5E9] focus:border-[#111315] rounded-xl text-xs text-[#111315] focus:outline-none cursor-pointer"
              >
                {mandiYards.map((yard) => (
                  <option key={yard} value={yard}>{yard}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[#6C727F] mb-1 block">Produce / Crop</label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8F9FA] border border-[#E2E5E9] focus:border-[#111315] rounded-xl text-xs text-[#111315] focus:outline-none cursor-pointer"
                >
                  {cropOptions.map((crop) => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-[#6C727F] mb-1 block">Approx. Quantity (Quintals)</label>
                <input
                  type="number"
                  value={quantityQtl}
                  onChange={(e) => setQuantityQtl(Number(e.target.value))}
                  min={1}
                  className="w-full px-3.5 py-2.5 bg-[#F8F9FA] border border-[#E2E5E9] focus:border-[#111315] rounded-xl text-xs text-[#111315] focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[#6C727F] mb-1 block">Vehicle Number (Truck / Trolley)</label>
                <div className="relative">
                  <Truck className="absolute left-3.5 top-3 w-4 h-4 text-[#8A92A0]" />
                  <input
                    type="text"
                    value={vehicleNo}
                    onChange={(e) => setVehicleNo(e.target.value)}
                    placeholder="MP-09-AB-4821"
                    className="w-full pl-10 pr-3 py-2.5 bg-[#F8F9FA] border border-[#E2E5E9] focus:border-[#111315] rounded-xl text-xs text-[#111315] focus:outline-none uppercase"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#6C727F] mb-1 block">Unloading Date</label>
                <input
                  type="date"
                  value={slotDate}
                  onChange={(e) => setSlotDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8F9FA] border border-[#E2E5E9] focus:border-[#111315] rounded-xl text-xs text-[#111315] focus:outline-none cursor-pointer"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-[#6C727F] mb-1.5 block">
                Available Arrival Time Slot
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableTimeSlots.map((slot) => {
                  const isSelected = selectedSlotTime === slot;
                  return (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setSelectedSlotTime(slot)}
                      className={`p-2.5 rounded-xl text-left border text-xs transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "bg-[#111315] text-white border-[#111315] shadow-sm font-semibold"
                          : "bg-[#F8F9FA] border-[#E8EAEC] hover:bg-[#F0F2F5] text-[#111315]"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Clock size={13} className={isSelected ? "text-[#C8F52F]" : "text-[#8A92A0]"} />
                        <span className="truncate">{slot}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-[#F0F2F5] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#6C727F] hover:bg-[#F5F7F8] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#111315] hover:bg-black text-white text-xs font-semibold flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>Confirm & Generate Pass</span>
                <ArrowRight size={14} className="text-[#C8F52F]" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
