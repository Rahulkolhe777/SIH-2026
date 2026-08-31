import React, { memo } from "react";
import { QrCode, X, CheckCircle2 } from "lucide-react";
import type { FarmerBookingItem } from "./FarmerDashboard";

interface DigitalPassModalProps {
  booking: FarmerBookingItem | null;
  onClose: () => void;
}

export const DigitalPassModal = memo(function DigitalPassModal({
  booking,
  onClose,
}: DigitalPassModalProps) {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#E8EAEC] p-6 shadow-2xl space-y-4 text-left relative">
        <div className="flex items-center justify-between border-b border-[#F1F3F5] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#E8F5E9] text-[#059669] flex items-center justify-center">
              <QrCode size={16} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#0B2D1B]">APMC Gate Entry Pass</h3>
              <span className="text-[10px] text-[#5A6C5F]">Show at Mandi Security & Gate 02</span>
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

        {/* QR Card Canvas */}
        <div className="p-4 rounded-2xl bg-[#FCFCFA] border border-[#E8EAEC] space-y-3 text-center">
          <div className="w-40 h-40 mx-auto bg-white p-3 rounded-2xl border border-[#E2E5E9] shadow-xs flex flex-col items-center justify-center">
            <div className="w-full h-full bg-[#0B2D1B] text-[#C8F52F] rounded-xl flex items-center justify-center font-mono font-black text-xl tracking-widest">
              |||| ||| ||||
            </div>
          </div>

          <div>
            <span className="font-mono text-base font-bold text-[#0B2D1B] bg-white px-3 py-1 rounded-lg border border-[#E2E5E9]">
              {booking.tokenId}
            </span>
            <p className="text-[11px] text-[#059669] font-bold mt-1.5 flex items-center justify-center gap-1">
              <CheckCircle2 size={13} />
              <span>Valid for Gate Entry & Weighbridge #03</span>
            </p>
          </div>

          <div className="text-xs text-[#5A6C5F] space-y-1 text-left bg-white p-3 rounded-xl border border-[#E8EAED]">
            <div className="flex justify-between">
              <span>Mandi:</span>
              <strong className="text-[#0B2D1B]">{booking.mandiName}</strong>
            </div>
            <div className="flex justify-between">
              <span>Crop & Qty:</span>
              <strong className="text-[#0B2D1B]">
                {booking.crop} ({booking.quantityKg.toLocaleString("en-IN")} KG)
              </strong>
            </div>
            <div className="flex justify-between">
              <span>Slot Window:</span>
              <strong className="text-[#0B2D1B]">
                {booking.slotDate} • {booking.slotTime}
              </strong>
            </div>
            <div className="flex justify-between">
              <span>Assigned Bay:</span>
              <strong className="text-[#059669]">{booking.bayAssigned}</strong>
            </div>
            <div className="flex justify-between border-t border-[#F1F3F5] pt-1 mt-1">
              <span>Vehicle:</span>
              <strong className="font-mono text-[#0B2D1B]">{booking.truckNumber}</strong>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 bg-[#0B2D1B] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#06180E] cursor-pointer transition-colors"
        >
          Done / Close Pass
        </button>
      </div>
    </div>
  );
});
