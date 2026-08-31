import React, { useState } from "react";
import type { Booking, MandiSlot, DashboardMetrics } from "../types/mandi.types";
import { StatusBadge, CapacityBar } from "../components/Badge";
import { Modal } from "../components/Modal";
import { IconQr, IconCheck, IconRefresh } from "../components/Icons";

interface DashboardPageProps {
  bookings: Booking[];
  slots: MandiSlot[];
  metrics: DashboardMetrics;
  isApproved?: boolean;
  approvalStatus?: string;
  onGoToSettings?: () => void;
  onUpdateBookingStatus: (id: string, status: Booking["status"], notes?: string) => void;
  onQuickVerifyToken: (tokenOrId: string) => { found: boolean; booking?: Booking };
  onApplyDefaultSlotsPreset: () => void;
}

export function DashboardPage({
  bookings,
  slots,
  metrics,
  isApproved = true,
  approvalStatus = "APPROVED",
  onGoToSettings,
  onUpdateBookingStatus,
  onQuickVerifyToken,
  onApplyDefaultSlotsPreset,
}: DashboardPageProps) {
  const [activeTab, setActiveTab] = useState<"current" | "previous">("current");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  // QR / Token Verification Modal
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const [lookupResult, setLookupResult] = useState<Booking | null>(null);
  const [lookupError, setLookupError] = useState("");
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  // View Details / QR Modal
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);

  // Reject Remark Modal
  const [rejectingBookingId, setRejectingBookingId] = useState<string | null>(null);
  const [rejectionRemark, setRejectionRemark] = useState("Capacity exceeded / Moisture above threshold");

  // Filter current vs previous bookings
  const currentBookings = bookings.filter((b) =>
    ["PENDING", "ACCEPTED", "ARRIVED", "VERIFIED"].includes(b.status)
  );

  const previousBookings = bookings.filter((b) =>
    ["COMPLETED", "REJECTED", "CANCELLED"].includes(b.status)
  );

  const displayedBookings = (activeTab === "current" ? currentBookings : previousBookings).filter(
    (b) => filterStatus === "ALL" || b.status === filterStatus
  );

  const handleVerifyLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError("");
    setVerificationSuccess(false);

    if (!tokenInput.trim()) {
      setLookupError("Please enter a valid Token or Booking ID.");
      return;
    }

    const res = onQuickVerifyToken(tokenInput.trim());
    if (res.found && res.booking) {
      setLookupResult(res.booking);
    } else {
      setLookupError(`No active booking found matching "${tokenInput}".`);
      setLookupResult(null);
    }
  };

  const handleConfirmVerification = (bookingId: string) => {
    onUpdateBookingStatus(bookingId, "VERIFIED", "Verified via Gate QR/Token Scanner.");
    setVerificationSuccess(true);
    setTimeout(() => {
      setShowVerifyModal(false);
      setLookupResult(null);
      setTokenInput("");
      setVerificationSuccess(false);
    }, 1200);
  };

  const handleMarkComplete = (bookingId: string) => {
    onUpdateBookingStatus(bookingId, "COMPLETED", "Weighbridge check and final payout settlement completed.");
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (rejectingBookingId) {
      onUpdateBookingStatus(rejectingBookingId, "REJECTED", rejectionRemark);
      setRejectingBookingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Glance View Banner for Unapproved Mandis */}
      {!isApproved && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 text-lg">⏳</span>
            <div>
              <h3 className="text-sm font-bold text-amber-200">
                Mandi Account Pending Verification (Glance View Only)
              </h3>
              <p className="text-xs text-amber-300/80 mt-0.5">
                Current Status: <strong className="font-mono">{approvalStatus}</strong>. Please complete your APMC Yard and Statutory KYC details in Settings to submit for Administrator Approval.
              </p>
            </div>
          </div>
          {onGoToSettings && (
            <button
              onClick={onGoToSettings}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-xl transition flex-shrink-0 shadow-md"
            >
              Complete Mandi & KYC Settings →
            </button>
          )}
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Today's Total Slots</span>
            <span className="text-emerald-400">🌾 Active Yard</span>
          </div>
          <div className="text-2xl font-bold text-white">{metrics.totalSlotsToday} Slots</div>
          <div className="text-xs text-zinc-500">Across Wheat, Rice, Mustard</div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Active Farmer Bookings</span>
            <span className="text-blue-400">📋 In Pipeline</span>
          </div>
          <div className="text-2xl font-bold text-white">{metrics.activeBookings} Bookings</div>
          <div className="text-xs text-zinc-500">{metrics.pendingApprovals} awaiting approval</div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Yard Arrivals Today</span>
            <span className="text-purple-400">🚛 Gate Verified</span>
          </div>
          <div className="text-2xl font-bold text-white">{metrics.arrivalsToday} Arrivals</div>
          <div className="text-xs text-zinc-500">{metrics.completedToday} completed weigh-ins</div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Overall Capacity Utilized</span>
            <span className="text-amber-400 font-semibold">{metrics.totalCapacityUtilizedPercentage}%</span>
          </div>
          <CapacityBar percentage={metrics.totalCapacityUtilizedPercentage} />
          <div className="text-xs text-zinc-500">Buffer tolerance active</div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="flex p-1 bg-zinc-950 rounded-xl border border-zinc-800 text-xs font-semibold">
            <button
              onClick={() => {
                setActiveTab("current");
                setFilterStatus("ALL");
              }}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === "current"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Current Bookings ({currentBookings.length})
            </button>
            <button
              onClick={() => {
                setActiveTab("previous");
                setFilterStatus("ALL");
              }}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === "previous"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Previous Logs ({previousBookings.length})
            </button>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">Filter Status: All</option>
            {activeTab === "current" ? (
              <>
                <option value="PENDING">Pending Approval</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="ARRIVED">Arrived at Yard</option>
                <option value="VERIFIED">Gate Verified</option>
              </>
            ) : (
              <>
                <option value="COMPLETED">Completed</option>
                <option value="REJECTED">Rejected</option>
                <option value="CANCELLED">Cancelled</option>
              </>
            )}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              setTokenInput("");
              setLookupResult(null);
              setLookupError("");
              setShowVerifyModal(true);
            }}
            className="flex-1 sm:flex-initial px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 transition-all"
          >
            <IconQr className="w-4 h-4" />
            <span>Verify QR / Token</span>
          </button>

          <button
            onClick={onApplyDefaultSlotsPreset}
            title="Populate recommended default slots for Mandi operating hours"
            className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-medium rounded-xl border border-zinc-700/60 transition-colors flex items-center gap-1.5"
          >
            <IconRefresh className="w-3.5 h-3.5 text-zinc-400" />
            <span>Default Slots</span>
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950/70 text-zinc-400 font-semibold border-b border-zinc-800 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Booking / Token</th>
                <th className="px-5 py-3.5">Farmer Details</th>
                <th className="px-5 py-3.5">Crop & Variety</th>
                <th className="px-5 py-3.5">Quantity & %</th>
                <th className="px-5 py-3.5">Arrival Slot</th>
                <th className="px-5 py-3.5">Vehicle</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {displayedBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-zinc-500">
                    No bookings found matching current filters.
                  </td>
                </tr>
              ) : (
                displayedBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-white">
                      <div className="text-emerald-400">{b.token}</div>
                      <div className="text-[10px] text-zinc-500">{b.id}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white">{b.farmerName}</div>
                      <div className="text-[11px] text-zinc-400">{b.farmerPhone}</div>
                      <div className="text-[9px] text-zinc-600 font-mono">{b.farmerId}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-zinc-200">{b.crop}</div>
                      <div className="text-[10px] text-zinc-500">{b.variety || "Standard"}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-white">{b.quantityQuintals} Qtl</div>
                      <div className="text-[10px] text-zinc-400">({b.capacityPercentage}% of slot)</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-zinc-200">{b.slotTime}</div>
                      <div className="text-[10px] text-zinc-500">{b.slotDate}</div>
                    </td>
                    <td className="px-5 py-4 font-mono text-[11px] text-zinc-300">
                      {b.vehicleNumber || "—"}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="px-5 py-4 text-right space-x-1.5 whitespace-nowrap">
                      {/* Action buttons based on status */}
                      {b.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => onUpdateBookingStatus(b.id, "ACCEPTED", "Booking confirmed by Mandi Operator.")}
                            className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-[11px] font-semibold transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => {
                              setRejectingBookingId(b.id);
                              setRejectionRemark("Capacity exceeded for this window");
                            }}
                            className="px-2.5 py-1 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 rounded-lg text-[11px] font-semibold transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {b.status === "ACCEPTED" && (
                        <button
                          onClick={() => {
                            setTokenInput(b.token);
                            setShowVerifyModal(true);
                            setLookupResult(b);
                          }}
                          className="px-2.5 py-1 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 rounded-lg text-[11px] font-semibold transition-colors"
                        >
                          Verify Entry
                        </button>
                      )}

                      {b.status === "ARRIVED" && (
                        <button
                          onClick={() => handleConfirmVerification(b.id)}
                          className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-[11px] font-semibold transition-colors"
                        >
                          Gate Check-In
                        </button>
                      )}

                      {b.status === "VERIFIED" && (
                        <button
                          onClick={() => handleMarkComplete(b.id)}
                          className="px-2.5 py-1 bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/40 rounded-lg text-[11px] font-semibold transition-colors"
                        >
                          Mark Complete
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setSelectedBooking(b);
                          setShowQRModal(true);
                        }}
                        title="View QR Code Receipt"
                        className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-[11px]"
                      >
                        <IconQr className="w-3.5 h-3.5 inline" />
                      </button>

                      <button
                        onClick={() => {
                          setSelectedBooking(b);
                          setShowQRModal(false);
                        }}
                        className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-[11px] transition-colors"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR / Token Verification Modal */}
      <Modal
        isOpen={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        title="Gate Verification — QR Code & Token Lookup"
        subtitle="Verify farmer identity and authorize weighbridge slot entry"
      >
        <div className="space-y-4">
          <form onSubmit={handleVerifyLookup} className="space-y-3">
            <label className="block text-xs font-medium text-zinc-400">
              Scan QR Code or Enter Token Number
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="e.g. TKN-7821 or BK-98421"
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-white font-mono text-sm uppercase focus:border-emerald-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-md transition-colors"
              >
                Lookup
              </button>
            </div>
          </form>

          {/* Simulated QR Scanner Graphic */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-dashed border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-emerald-400">
                <IconQr className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="font-semibold text-zinc-200">Camera Scanner Active</div>
                <div className="text-[10px] text-zinc-500">Aim camera at farmer's receipt QR</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const sample = bookings.find((b) => b.status === "ARRIVED" || b.status === "ACCEPTED");
                if (sample) {
                  setTokenInput(sample.token);
                  setLookupResult(sample);
                  setLookupError("");
                }
              }}
              className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-emerald-400 text-[11px] font-semibold"
            >
              Simulate Scan
            </button>
          </div>

          {lookupError && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs">
              ⚠️ {lookupError}
            </div>
          )}

          {verificationSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
              <IconCheck className="w-4 h-4 text-emerald-400" />
              <span>Gate Entry Verified! Farmer checked into weighbridge queue.</span>
            </div>
          )}

          {lookupResult && !verificationSuccess && (
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <div>
                  <div className="text-xs text-zinc-500">Token ID</div>
                  <div className="text-base font-bold text-emerald-400 font-mono">
                    {lookupResult.token}
                  </div>
                </div>
                <StatusBadge status={lookupResult.status} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-zinc-500">Farmer:</span>{" "}
                  <span className="font-semibold text-white">{lookupResult.farmerName}</span>
                </div>
                <div>
                  <span className="text-zinc-500">Phone:</span>{" "}
                  <span className="text-zinc-300">{lookupResult.farmerPhone}</span>
                </div>
                <div>
                  <span className="text-zinc-500">Crop:</span>{" "}
                  <span className="font-semibold text-white">{lookupResult.crop}</span>
                </div>
                <div>
                  <span className="text-zinc-500">Quantity:</span>{" "}
                  <span className="font-bold text-emerald-400">
                    {lookupResult.quantityQuintals} Quintals
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500">Vehicle No:</span>{" "}
                  <span className="font-mono text-zinc-300">
                    {lookupResult.vehicleNumber || "Not recorded"}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500">Allotted Slot:</span>{" "}
                  <span className="text-zinc-300">{lookupResult.slotTime}</span>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleConfirmVerification(lookupResult.id)}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition-all shadow-md"
                >
                  ✓ Confirm Gate Verification
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkComplete(lookupResult.id)}
                  className="px-4 py-2.5 bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/40 text-xs font-semibold rounded-xl"
                >
                  Mark Complete
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Reject Remark Modal */}
      <Modal
        isOpen={!!rejectingBookingId}
        onClose={() => setRejectingBookingId(null)}
        title="Reject Booking Request"
        subtitle="Provide reason for booking cancellation/rejection"
      >
        <form onSubmit={handleConfirmReject} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-400 font-medium mb-1">Rejection Remark / Reason</label>
            <textarea
              rows={3}
              required
              value={rejectionRemark}
              onChange={(e) => setRejectionRemark(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-white focus:border-rose-500 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 border-t border-zinc-800 pt-2">
            <button
              type="button"
              onClick={() => setRejectingBookingId(null)}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl shadow-md"
            >
              Confirm Rejection
            </button>
          </div>
        </form>
      </Modal>

      {/* Booking Details / QR Modal */}
      <Modal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title={showQRModal ? "Farmer Verification QR Code" : `Booking #${selectedBooking?.token || ""}`}
        subtitle="Complete transaction & arrival specifications"
      >
        {selectedBooking && (
          <div className="space-y-4 text-xs">
            {showQRModal ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-48 h-48 mx-auto p-3 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                  {/* Visual QR Code Generator Simulation */}
                  <div className="w-full h-full border-4 border-black p-2 flex flex-col justify-between">
                    <div className="flex justify-between">
                      <div className="w-8 h-8 bg-black" />
                      <div className="w-8 h-8 bg-black" />
                    </div>
                    <div className="font-mono font-bold text-[10px] text-black">
                      {selectedBooking.token}
                    </div>
                    <div className="flex justify-between">
                      <div className="w-8 h-8 bg-black" />
                      <div className="w-8 h-8 bg-zinc-400" />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="font-mono font-bold text-base text-emerald-400">
                    {selectedBooking.token}
                  </div>
                  <p className="text-zinc-400 mt-0.5">
                    Farmer: {selectedBooking.farmerName} • {selectedBooking.quantityQuintals} Qtl {selectedBooking.crop}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-zinc-500">Booking ID:</span>
                  <div className="font-mono font-bold text-white">{selectedBooking.id}</div>
                </div>
                <div>
                  <span className="text-zinc-500">Current Status:</span>
                  <div>
                    <StatusBadge status={selectedBooking.status} />
                  </div>
                </div>
                <div>
                  <span className="text-zinc-500">Farmer Name:</span>
                  <div className="font-semibold text-white">{selectedBooking.farmerName}</div>
                </div>
                <div>
                  <span className="text-zinc-500">Phone:</span>
                  <div className="text-zinc-300">{selectedBooking.farmerPhone}</div>
                </div>
                <div>
                  <span className="text-zinc-500">Crop & Variety:</span>
                  <div className="font-semibold text-emerald-400">
                    {selectedBooking.crop} ({selectedBooking.variety || "Standard"})
                  </div>
                </div>
                <div>
                  <span className="text-zinc-500">Quantity & Capacity %:</span>
                  <div className="font-bold text-white">
                    {selectedBooking.quantityQuintals} Qtl ({selectedBooking.capacityPercentage}%)
                  </div>
                </div>
                <div>
                  <span className="text-zinc-500">Time Window:</span>
                  <div className="text-zinc-300">
                    {selectedBooking.slotDate} ({selectedBooking.slotTime})
                  </div>
                </div>
                <div>
                  <span className="text-zinc-500">Vehicle Registration:</span>
                  <div className="font-mono text-zinc-300">
                    {selectedBooking.vehicleNumber || "N/A"}
                  </div>
                </div>
                <div>
                  <span className="text-zinc-500">Created:</span>
                  <div className="text-zinc-400">{selectedBooking.createdAt}</div>
                </div>
                <div>
                  <span className="text-zinc-500">Verified:</span>
                  <div className="text-zinc-400">{selectedBooking.verifiedAt || "Pending"}</div>
                </div>
              </div>
            )}

            {selectedBooking.notes && (
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-zinc-500 block mb-1">Remarks / Operator Notes:</span>
                <p className="text-zinc-300 italic">{selectedBooking.notes}</p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
