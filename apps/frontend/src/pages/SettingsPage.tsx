import React, { useState } from "react";
import type { MandiProfile } from "../types/mandi.types";
import { Modal } from "../components/Modal";
import { IconUpload, IconCheck, IconShield, IconPlus, IconTrash, IconStar } from "../components/Icons";
import { ApprovalBadge } from "../components/Badge";

interface SettingsPageProps {
  profile: MandiProfile;
  onUpdateProfile: (updated: MandiProfile) => void;
}

export function SettingsPage({ profile, onUpdateProfile }: SettingsPageProps) {
  const [formData, setFormData] = useState<MandiProfile>({
    ...profile,
    rating: profile?.rating ?? 4.8,
    totalReviews: profile?.totalReviews ?? 142,
    legalDocs: profile?.legalDocs || [],
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Aadhaar Modal
  const [showAadhaarModal, setShowAadhaarModal] = useState(false);
  const [aadhaarInput, setAadhaarInput] = useState(profile?.aadhaarNumber || "");
  const [aadhaarFileName, setAadhaarFileName] = useState(profile?.aadhaarDocName || "");

  // Legal Doc Modal
  const [showDocModal, setShowDocModal] = useState(false);
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState<"MANDI_LICENSE" | "APMC_REGISTRATION" | "GST_CERTIFICATE">("MANDI_LICENSE");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAadhaarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: MandiProfile = {
      ...formData,
      aadhaarNumber: aadhaarInput || "•••• •••• " + Math.floor(1000 + Math.random() * 9000),
      aadhaarVerified: true,
      aadhaarDocName: aadhaarFileName || "Mandi_Operator_Aadhaar.pdf",
    };
    setFormData(updated);
    onUpdateProfile(updated);
    setShowAadhaarModal(false);
  };

  const handleAddLegalDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    const newDoc = {
      id: `doc-${Date.now()}`,
      name: docName,
      type: docType,
      status: "PENDING" as const,
      uploadedAt: (new Date().toISOString().split("T")[0] as string) || "2026-08-30",
    };

    const updated: MandiProfile = {
      ...formData,
      legalDocs: [...(formData.legalDocs || []), newDoc],
    };

    setFormData(updated);
    onUpdateProfile(updated);
    setShowDocModal(false);
    setDocName("");
  };

  const handleDeleteLegalDoc = (id: string) => {
    const updated: MandiProfile = {
      ...formData,
      legalDocs: (formData.legalDocs || []).filter((d) => d.id !== id),
    };
    setFormData(updated);
    onUpdateProfile(updated);
  };

  const ratingVal = Number(formData.rating ?? 4.8);
  const totalReviewsVal = Number(formData.totalReviews ?? 142);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Header */}
      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Mandi & Operator Settings</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage your APMC market yard identity, KYC documentation, and compliance credentials.
          </p>
        </div>
        {savedSuccess && (
          <div className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-1.5 animate-in fade-in">
            <IconCheck className="w-4 h-4 text-emerald-400" />
            <span>Profile Saved!</span>
          </div>
        )}
      </div>

      {/* Mandi Rating & Reputation Card */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-amber-950/30 p-6 rounded-2xl border border-amber-900/30 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Farmer Rating & Reliability Score
            </span>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>{ratingVal.toFixed(1)} / 5.0</span>
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((i) => (
                  <IconStar key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
            </h3>
            <p className="text-xs text-zinc-400">
              Based on {totalReviewsVal} verified farmer transactions across weighbridge accuracy, timely payout & slot management.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-2 bg-emerald-950/60 border border-emerald-800/60 rounded-xl text-center">
              <div className="text-emerald-400 font-bold text-sm">99.2%</div>
              <div className="text-[10px] text-zinc-400">Weigh-in Precision</div>
            </div>
            <div className="px-3 py-2 bg-blue-950/60 border border-blue-800/60 rounded-xl text-center">
              <div className="text-blue-400 font-bold text-sm">&lt; 15 mins</div>
              <div className="text-[10px] text-zinc-400">Avg Gate Wait</div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Statutory Accreditation & Approval
            </span>
            <h3 className="text-sm font-bold text-white mt-0.5">
              APMC Mandi Verification Status
            </h3>
          </div>
          <ApprovalBadge status={formData.approvalStatus || "PENDING_ONBOARDING"} />
        </div>

        {formData.approvalStatus !== "APPROVED" && (
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
            <p className="text-xs text-zinc-300">
              Ensure all your APMC Yard parameters, Aadhaar KYC, and Statutory Documents are filled below, then submit for administrator verification to unlock full slot creation and gate check-in.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={async () => {
                  setSavedSuccess(true);
                  const updated: MandiProfile = {
                    ...formData,
                    approvalStatus: "PENDING_APPROVAL",
                  };
                  setFormData(updated);
                  onUpdateProfile(updated);
                  setTimeout(() => setSavedSuccess(false), 3000);
                }}
                className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition shadow-md flex items-center gap-1.5"
              >
                <IconCheck className="w-4 h-4" />
                Submit Mandi Profile & KYC for Admin Approval
              </button>

              <button
                type="button"
                onClick={async () => {
                  const updated: MandiProfile = {
                    ...formData,
                    approvalStatus: "APPROVED",
                  };
                  setFormData(updated);
                  onUpdateProfile(updated);
                }}
                className="py-2 px-4 bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-semibold text-xs rounded-xl transition flex items-center gap-1.5 border border-zinc-700"
              >
                <IconShield className="w-4 h-4 text-amber-400" />
                Simulate Admin Approval (Dev Toggle)
              </button>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Card & Avatar */}
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>👤</span> Operator & Yard Profile
            </h3>
            <ApprovalBadge status={formData.approvalStatus || "APPROVED"} />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl bg-zinc-800 border-2 border-dashed border-zinc-700 flex flex-col items-center justify-center text-zinc-400 hover:text-white hover:border-emerald-500 transition-all cursor-pointer">
                {formData.avatarUrl ? (
                  <img
                    src={formData.avatarUrl}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <>
                    <IconUpload className="w-6 h-6 mb-1 text-emerald-400" />
                    <span className="text-[10px]">Upload Photo</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-1 text-center sm:text-left">
              <h4 className="text-base font-bold text-white">{formData.name}</h4>
              <p className="text-xs text-emerald-400 font-medium">{formData.mandiName}</p>
              <p className="text-[11px] text-zinc-500">APMC Yard Identifier: {formData.apmcCode}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Operator Full Name</label>
              <input
                type="text"
                required
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-medium mb-1">APMC Mandi Yard Name</label>
              <input
                type="text"
                required
                value={formData.mandiName || ""}
                onChange={(e) => setFormData({ ...formData, mandiName: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-medium mb-1">Official Email Address</label>
              <input
                type="email"
                required
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-medium mb-1">Contact Phone</label>
              <input
                type="tel"
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-medium mb-1">Operating Hours</label>
              <input
                type="text"
                value={formData.operatingHours || ""}
                onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                placeholder="08:00 AM - 06:00 PM"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-medium mb-1">APMC Code / License No</label>
              <input
                type="text"
                value={formData.apmcCode || ""}
                onChange={(e) => setFormData({ ...formData, apmcCode: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-zinc-400 font-medium mb-1">Physical Yard Address</label>
              <textarea
                rows={2}
                value={formData.address || ""}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Aadhaar Verification Card */}
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <IconShield className="w-4 h-4 text-emerald-400" />
              <span>Aadhaar Identity Verification</span>
            </h3>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                formData.aadhaarVerified
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/30"
              }`}
            >
              {formData.aadhaarVerified ? "✓ Aadhaar Verified" : "Pending Verification"}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-xs">
            <div className="space-y-1">
              <div className="text-zinc-400">Linked Aadhaar Identification:</div>
              <div className="font-mono text-base font-bold text-white">
                {formData.aadhaarNumber || "No Aadhaar Linked"}
              </div>
              {formData.aadhaarDocName && (
                <div className="text-[11px] text-zinc-500">Document: {formData.aadhaarDocName}</div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowAadhaarModal(true)}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white rounded-xl text-xs font-semibold border border-zinc-700 transition-colors"
            >
              {formData.aadhaarVerified ? "Update Aadhaar Card" : "Upload Aadhaar Card"}
            </button>
          </div>
        </div>

        {/* Legal & APMC Compliance Documents */}
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>📑</span> Mandi Legal Documents & Licenses
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Upload APMC operating license, market committee registration, and tax credentials.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowDocModal(true)}
              className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <IconPlus className="w-3.5 h-3.5" />
              <span>Add Document</span>
            </button>
          </div>

          <div className="space-y-2">
            {(formData.legalDocs || []).map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3.5 bg-zinc-950 rounded-xl border border-zinc-800 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-400">
                    📄
                  </div>
                  <div>
                    <div className="font-semibold text-white">{doc.name}</div>
                    <div className="text-[10px] text-zinc-500">
                      Type: {doc.type.replace("_", " ")} • Uploaded: {doc.uploadedAt}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      doc.status === "VERIFIED"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    }`}
                  >
                    {doc.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteLegalDoc(doc.id)}
                    className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors"
                    title="Remove Document"
                  >
                    <IconTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-emerald-950/60 transition-all"
          >
            Save Mandi Settings
          </button>
        </div>
      </form>

      {/* Aadhaar Upload Modal */}
      <Modal
        isOpen={showAadhaarModal}
        onClose={() => setShowAadhaarModal(false)}
        title="Aadhaar Verification"
        subtitle="Submit Aadhaar number and front/back document scan"
      >
        <form onSubmit={handleAadhaarSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-400 font-medium mb-1">12-Digit Aadhaar Number</label>
            <input
              type="text"
              required
              value={aadhaarInput}
              onChange={(e) => setAadhaarInput(e.target.value)}
              placeholder="5412 8901 2345"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-zinc-400 font-medium mb-1">Upload Aadhaar PDF / Image</label>
            <div className="border-2 border-dashed border-zinc-800 hover:border-emerald-500 rounded-xl p-6 text-center cursor-pointer bg-zinc-950 transition-colors">
              <IconUpload className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <div className="text-zinc-300 font-semibold">Click to select file or drag here</div>
              <div className="text-[10px] text-zinc-500 mt-1">PDF, JPG, PNG up to 10MB</div>
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setShowAadhaarModal(false)}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl"
            >
              Verify Aadhaar
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Legal Doc Modal */}
      <Modal
        isOpen={showDocModal}
        onClose={() => setShowDocModal(false)}
        title="Add Legal / APMC Document"
        subtitle="Upload operating licenses and compliance certificates"
      >
        <form onSubmit={handleAddLegalDoc} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-400 font-medium mb-1">Document Title</label>
            <input
              type="text"
              required
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              placeholder="e.g. State Agricultural Marketing Board Authorization"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-zinc-400 font-medium mb-1">Document Category</label>
            <select
              value={docType}
              onChange={(e: any) => setDocType(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="MANDI_LICENSE">APMC Mandi Operating License</option>
              <option value="APMC_REGISTRATION">State Marketing Board Registration</option>
              <option value="GST_CERTIFICATE">GST Certificate</option>
            </select>
          </div>

          <div>
            <label className="block text-zinc-400 font-medium mb-1">Document File</label>
            <div className="border-2 border-dashed border-zinc-800 hover:border-emerald-500 rounded-xl p-6 text-center cursor-pointer bg-zinc-950 transition-colors">
              <IconUpload className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <div className="text-zinc-300 font-semibold">Select legal certificate (PDF/Image)</div>
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setShowDocModal(false)}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl"
            >
              Upload Document
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
