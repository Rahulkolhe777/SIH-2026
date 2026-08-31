import React, { useState } from "react";
import type { MandiSlot } from "../types/mandi.types";
import { CapacityBar } from "../components/Badge";
import { Modal } from "../components/Modal";
import { IconPlus, IconEdit, IconTrash } from "../components/Icons";

interface SlotsPageProps {
  slots: MandiSlot[];
  onCreateSlot: (slot: Omit<MandiSlot, "id" | "bookedCapacityQuintals" | "capacityPercentage" | "bookedFarmers" | "availableBookings">) => void;
  onUpdateSlot: (id: string, updated: Partial<MandiSlot>) => void;
  onDeleteSlot: (id: string) => void;
}

const COMMON_CROPS = [
  "Wheat (Sharbati)",
  "Wheat (Kalyan Sona)",
  "Rice (Basmati 1121)",
  "Rice (Non-Basmati)",
  "Mustard (Sarson)",
  "Soyabean (Yellow)",
  "Cotton (Medium Staple)",
  "Chana (Gram / Chickpea)",
  "Maize (Corn)",
  "Tur / Arhar (Pigeon Pea)",
];

export function SlotsPage({ slots, onCreateSlot, onUpdateSlot, onDeleteSlot }: SlotsPageProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState<MandiSlot | null>(null);
  const [deletingSlotId, setDeletingSlotId] = useState<string | null>(null);

  // Form State for Creation
  const [crop, setCrop] = useState(COMMON_CROPS[0] as string);
  const [customCrop, setCustomCrop] = useState("");
  const [date, setDate] = useState((new Date().toISOString().split("T")[0] as string) || "2026-08-30");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("12:00");
  const [totalCapacityQuintals, setTotalCapacityQuintals] = useState(500);
  const [maxFarmers, setMaxFarmers] = useState(20);
  const [bufferMinutes, setBufferMinutes] = useState(15);
  const [bufferPercentage, setBufferPercentage] = useState(10);

  // Filter
  const [filterDate, setFilterDate] = useState<string>("");

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCrop = crop === "CUSTOM" ? customCrop : crop;

    onCreateSlot({
      crop: finalCrop || "General Grain",
      date,
      startTime,
      endTime,
      totalCapacityQuintals: Number(totalCapacityQuintals),
      maxFarmers: Number(maxFarmers),
      bufferMinutes: Number(bufferMinutes),
      bufferPercentage: Number(bufferPercentage),
      isActive: true,
    });

    setShowCreateModal(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlot) return;

    onUpdateSlot(editingSlot.id, {
      crop: editingSlot.crop,
      date: editingSlot.date,
      startTime: editingSlot.startTime,
      endTime: editingSlot.endTime,
      totalCapacityQuintals: Number(editingSlot.totalCapacityQuintals),
      maxFarmers: Number(editingSlot.maxFarmers),
      bufferMinutes: Number(editingSlot.bufferMinutes),
      bufferPercentage: Number(editingSlot.bufferPercentage),
    });

    setEditingSlot(null);
  };

  const filteredSlots = filterDate
    ? slots.filter((s) => s.date === filterDate)
    : slots;

  return (
    <div className="space-y-6">
      {/* Top Header & Slot Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Manage Mandi Arrival Slots</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Configure crop-wise intake capacity, time windows, farmer limits & weighbridge buffers.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
          />
          {filterDate && (
            <button
              onClick={() => setFilterDate("")}
              className="text-xs text-zinc-500 hover:text-zinc-300"
            >
              Clear
            </button>
          )}

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-950/60 transition-all ml-auto sm:ml-0"
          >
            <IconPlus className="w-4 h-4" />
            <span>Create New Slot</span>
          </button>
        </div>
      </div>

      {/* Slots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSlots.map((slot) => {
          const isFull = slot.bookedCapacityQuintals >= slot.totalCapacityQuintals;
          return (
            <div
              key={slot.id}
              className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5 space-y-4 shadow-lg hover:border-zinc-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                      {slot.id}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1.5">{slot.crop}</h3>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isFull
                        ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    }`}
                  >
                    {isFull ? "SLOT FULL" : "OPEN FOR BOOKING"}
                  </span>
                </div>

                {/* Timing & Date */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80">
                  <div>
                    <span className="text-zinc-500 block">Date</span>
                    <span className="font-semibold text-zinc-200">{slot.date}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Window</span>
                    <span className="font-semibold text-zinc-200">
                      {slot.startTime} - {slot.endTime}
                    </span>
                  </div>
                </div>

                {/* Capacity Progress */}
                <div className="space-y-1">
                  <CapacityBar
                    percentage={slot.capacityPercentage}
                    label="Intake Capacity Booked"
                    sublabel={`${slot.bookedCapacityQuintals} / ${slot.totalCapacityQuintals} Qtl (${slot.capacityPercentage.toFixed(0)}%)`}
                  />
                </div>

                {/* Farmer counts & buffers */}
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-zinc-400">
                  <div>
                    <span className="text-zinc-500">Farmers:</span>{" "}
                    <span className="font-semibold text-white">
                      {slot.bookedFarmers} / {slot.maxFarmers}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Available:</span>{" "}
                    <span className="font-semibold text-emerald-400">
                      {slot.availableBookings} slots
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Buffer Time:</span>{" "}
                    <span className="text-zinc-300">{slot.bufferMinutes} mins</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Buffer %:</span>{" "}
                    <span className="text-zinc-300">+{slot.bufferPercentage}% tolerance</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-zinc-800">
                <button
                  onClick={() => setEditingSlot({ ...slot })}
                  className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <IconEdit className="w-3.5 h-3.5" />
                  <span>Edit Slot</span>
                </button>
                <button
                  onClick={() => setDeletingSlotId(slot.id)}
                  className="p-2 bg-rose-950/40 hover:bg-rose-950/70 border border-rose-800/40 hover:border-rose-700 text-rose-300 rounded-xl transition-colors"
                  title="Delete Slot"
                >
                  <IconTrash className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Slot Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Mandi Arrival Slot"
        subtitle="Specify crop intake quotas, schedule, and buffers"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-400 font-medium mb-1">Crop Type</label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
            >
              {COMMON_CROPS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value="CUSTOM">+ Custom / Other Crop</option>
            </select>
          </div>

          {crop === "CUSTOM" && (
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Specify Crop Name</label>
              <input
                type="text"
                required
                value={customCrop}
                onChange={(e) => setCustomCrop(e.target.value)}
                placeholder="e.g. Barley / Jowar"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Slot Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Start Time</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-400 font-medium mb-1">End Time</label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 font-medium mb-1">
                Target Capacity (Quintals)
              </label>
              <input
                type="number"
                min="10"
                max="5000"
                required
                value={totalCapacityQuintals}
                onChange={(e) => setTotalCapacityQuintals(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Max Allowable Farmers</label>
              <input
                type="number"
                min="1"
                max="200"
                required
                value={maxFarmers}
                onChange={(e) => setMaxFarmers(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 font-medium mb-1">
                Slot Buffer Time (Minutes)
              </label>
              <input
                type="number"
                min="0"
                max="120"
                value={bufferMinutes}
                onChange={(e) => setBufferMinutes(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
              />
              <span className="text-[10px] text-zinc-500 mt-1 block">
                Time between consecutive arrivals
              </span>
            </div>
            <div>
              <label className="block text-zinc-400 font-medium mb-1">
                Capacity Buffer Tolerance (%)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={bufferPercentage}
                onChange={(e) => setBufferPercentage(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
              />
              <span className="text-[10px] text-zinc-500 mt-1 block">
                Extra overflow buffer margin
              </span>
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-md"
            >
              Create Slot
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Slot Modal */}
      <Modal
        isOpen={!!editingSlot}
        onClose={() => setEditingSlot(null)}
        title={`Edit Slot #${editingSlot?.id || ""}`}
        subtitle="Update slot parameters and quotas"
      >
        {editingSlot && (
          <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Crop</label>
              <input
                type="text"
                required
                value={editingSlot.crop}
                onChange={(e) => setEditingSlot({ ...editingSlot, crop: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-zinc-400 font-medium mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={editingSlot.date}
                  onChange={(e) => setEditingSlot({ ...editingSlot, date: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-zinc-400 font-medium mb-1">Start</label>
                <input
                  type="time"
                  required
                  value={editingSlot.startTime}
                  onChange={(e) => setEditingSlot({ ...editingSlot, startTime: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-zinc-400 font-medium mb-1">End</label>
                <input
                  type="time"
                  required
                  value={editingSlot.endTime}
                  onChange={(e) => setEditingSlot({ ...editingSlot, endTime: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 font-medium mb-1">Total Capacity (Qtl)</label>
                <input
                  type="number"
                  required
                  value={editingSlot.totalCapacityQuintals}
                  onChange={(e) =>
                    setEditingSlot({
                      ...editingSlot,
                      totalCapacityQuintals: Number(e.target.value),
                    })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-zinc-400 font-medium mb-1">Max Farmers</label>
                <input
                  type="number"
                  required
                  value={editingSlot.maxFarmers}
                  onChange={(e) =>
                    setEditingSlot({ ...editingSlot, maxFarmers: Number(e.target.value) })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 font-medium mb-1">Buffer Time (Mins)</label>
                <input
                  type="number"
                  value={editingSlot.bufferMinutes}
                  onChange={(e) =>
                    setEditingSlot({ ...editingSlot, bufferMinutes: Number(e.target.value) })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-zinc-400 font-medium mb-1">Buffer Tolerance (%)</label>
                <input
                  type="number"
                  value={editingSlot.bufferPercentage}
                  onChange={(e) =>
                    setEditingSlot({ ...editingSlot, bufferPercentage: Number(e.target.value) })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setEditingSlot(null)}
                className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-md"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Slot Confirmation Modal */}
      <Modal
        isOpen={!!deletingSlotId}
        onClose={() => setDeletingSlotId(null)}
        title="Confirm Slot Deletion"
        subtitle="Cascade cancellation for all bookings in this window"
      >
        <div className="space-y-4 text-xs">
          <p className="text-rose-300 font-medium">
            ⚠️ Warning: Deleting this slot will remove it from active trading and automatically cancel/reject all farmer bookings registered for this window with a "Slot Cancelled by Mandi" remark.
          </p>

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setDeletingSlotId(null)}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (deletingSlotId) onDeleteSlot(deletingSlotId);
                setDeletingSlotId(null);
              }}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl shadow-md"
            >
              Delete & Cancel Bookings
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
