import React from "react";
import type { BookingStatus, MandiApprovalStatus } from "../types/mandi.types";

export function StatusBadge({ status }: { status: BookingStatus }) {
  const styles: Record<BookingStatus, string> = {
    PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    ACCEPTED: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    ARRIVED: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    VERIFIED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    COMPLETED: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    REJECTED: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    CANCELLED: "bg-zinc-500/10 text-zinc-400 border-zinc-500/30",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
        styles[status] || "bg-zinc-800 text-zinc-300"
      }`}
    >
      {status}
    </span>
  );
}

export function ApprovalBadge({ status }: { status: MandiApprovalStatus }) {
  const styles: Record<MandiApprovalStatus, { bg: string; text: string; label: string }> = {
    APPROVED: {
      bg: "bg-emerald-500/10 border-emerald-500/30",
      text: "text-emerald-400",
      label: "✓ Verified & Approved Mandi",
    },
    PENDING_ONBOARDING: {
      bg: "bg-purple-500/10 border-purple-500/30",
      text: "text-purple-400",
      label: "📝 Onboarding Incomplete",
    },
    PENDING_APPROVAL: {
      bg: "bg-amber-500/10 border-amber-500/30",
      text: "text-amber-400",
      label: "⏳ Admin Verification Pending",
    },
    REJECTED: {
      bg: "bg-rose-500/10 border-rose-500/30",
      text: "text-rose-400",
      label: "✕ Application Rejected",
    },
    REQUIRES_DOCUMENTS: {
      bg: "bg-blue-500/10 border-blue-500/30",
      text: "text-blue-400",
      label: "ℹ Additional Docs Required",
    },
  };

  const conf = styles[status] || styles.APPROVED;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${conf.bg} ${conf.text}`}
    >
      {conf.label}
    </span>
  );
}

export function CapacityBar({
  percentage,
  label,
  sublabel,
}: {
  percentage: number;
  label?: string;
  sublabel?: string;
}) {
  const clamped = Math.min(100, Math.max(0, percentage));
  let color = "bg-emerald-500";
  if (clamped > 85) color = "bg-rose-500";
  else if (clamped > 65) color = "bg-amber-500";

  return (
    <div className="w-full space-y-1">
      {(label || sublabel) && (
        <div className="flex justify-between text-xs text-zinc-400">
          <span>{label}</span>
          <span className="font-semibold text-zinc-200">{sublabel || `${clamped.toFixed(1)}%`}</span>
        </div>
      )}
      <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-300 rounded-full`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
