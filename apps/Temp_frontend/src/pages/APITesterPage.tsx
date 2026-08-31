import React, { useState } from "react";
import { apiRequest, getAccessToken, getApiBaseUrl } from "../services/api";

const PRESET_ENDPOINTS = [
  {
    name: "Health Check",
    method: "GET",
    endpoint: "/health",
    body: "",
  },
  {
    name: "Mandi Dashboard (Protected by requireApprovedMandi)",
    method: "GET",
    endpoint: "/mandi/dashboard",
    body: "",
  },
  {
    name: "Post-Login Mandi Onboarding",
    method: "POST",
    endpoint: "/mandi/onboarding",
    body: JSON.stringify(
      {
        mandiName: "Indore APMC Grain Yard",
        apmcCode: "APMC-IND-MP-042",
        address: "Plot 44, Industrial Area, Bypass Highway",
        district: "Indore",
        state: "Madhya Pradesh",
        operatingHours: "07:30 AM - 06:00 PM (Mon-Sat)",
        aadhaarNumber: "541289012345",
        aadhaarDocUrl: "https://vault.agrimarket.gov.in/docs/aadhaar_verified.pdf",
        legalDocs: [
          {
            name: "APMC Mandi Operating License 2026",
            type: "MANDI_LICENSE",
            fileUrl: "https://vault.agrimarket.gov.in/docs/license.pdf",
          },
        ],
      },
      null,
      2
    ),
  },
  {
    name: "Admin: List Pending Mandis",
    method: "GET",
    endpoint: "/admin/mandi/pending",
    body: "",
  },
  {
    name: "Admin: Approve Mandi",
    method: "PATCH",
    endpoint: "/admin/mandi/REPLACE_WITH_MANDI_ID/approval-status",
    body: JSON.stringify(
      {
        status: "APPROVED",
      },
      null,
      2
    ),
  },
  {
    name: "Current User Profile (/auth/me)",
    method: "GET",
    endpoint: "/auth/me",
    body: "",
  },
  {
    name: "Register Mandi Operator (/user/mandi)",
    method: "POST",
    endpoint: "/user/mandi",
    body: JSON.stringify(
      {
        name: "Test Mandi Operator",
        email: "operator.test@agrimarket.gov.in",
        phone: "+919876543210",
        password: "TestPassword123",
      },
      null,
      2
    ),
  },
  {
    name: "Login (/auth/login)",
    method: "POST",
    endpoint: "/auth/login",
    body: JSON.stringify(
      {
        identifier: "operator.test@agrimarket.gov.in",
        password: "TestPassword123",
      },
      null,
      2
    ),
  },
];

export function APITesterPage() {
  const [baseUrl] = useState(getApiBaseUrl());
  const [method, setMethod] = useState("GET");
  const [endpoint, setEndpoint] = useState("/health");
  const [requestBody, setRequestBody] = useState("");
  const [responseOutput, setResponseOutput] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [statusInfo, setStatusInfo] = useState<{ status: number; duration: number } | null>(null);

  const token = getAccessToken();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponseOutput(null);
    setStatusInfo(null);

    const startTime = performance.now();

    try {
      const options: RequestInit = {
        method,
      };

      if (method !== "GET" && requestBody.trim()) {
        try {
          options.body = JSON.stringify(JSON.parse(requestBody));
        } catch {
          options.body = requestBody;
        }
      }

      const res = await apiRequest(endpoint, options);
      const endTime = performance.now();

      setStatusInfo({
        status: res.status,
        duration: Math.round(endTime - startTime),
      });

      setResponseOutput(res);
    } catch (err: any) {
      setResponseOutput({ error: err.message || "Network Error" });
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPreset = (preset: (typeof PRESET_ENDPOINTS)[0]) => {
    setMethod(preset.method);
    setEndpoint(preset.endpoint);
    setRequestBody(preset.body);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Backend API Debug Console</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Test and verify live Express backend endpoints on <code className="text-emerald-400 font-mono">http://localhost:4000/api/v1</code>.
          </p>
        </div>

        <div className="text-xs text-zinc-400 bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800">
          <span>Auth Bearer: </span>
          <span className="font-mono text-emerald-400 font-semibold">
            {token ? `${token.substring(0, 14)}...` : "None (Public)"}
          </span>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Quick Preset Requests:
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESET_ENDPOINTS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 rounded-xl text-xs font-medium transition-colors"
            >
              <span
                className={`font-mono font-bold mr-1.5 ${
                  p.method === "GET"
                    ? "text-blue-400"
                    : p.method === "PATCH"
                      ? "text-amber-400"
                      : "text-emerald-400"
                }`}
              >
                {p.method}
              </span>
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Request Form */}
      <form onSubmit={handleSend} className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 text-white font-mono font-bold text-xs rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
          </select>

          <div className="flex-1 flex bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden focus-within:border-emerald-500">
            <span className="bg-zinc-900 text-zinc-500 px-3.5 py-2.5 text-xs font-mono select-none border-r border-zinc-800 hidden sm:block">
              {baseUrl}
            </span>
            <input
              type="text"
              required
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="/mandi/dashboard"
              className="flex-1 bg-transparent px-3.5 py-2.5 text-white font-mono text-xs focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition-all shadow-md disabled:opacity-50"
          >
            {loading ? "Sending..." : "Execute Request"}
          </button>
        </div>

        {method !== "GET" && (
          <div>
            <label className="block text-xs text-zinc-400 font-medium mb-1">
              JSON Request Body
            </label>
            <textarea
              rows={5}
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              placeholder='{"key": "value"}'
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-emerald-300 font-mono text-xs focus:border-emerald-500 focus:outline-none"
            />
          </div>
        )}
      </form>

      {/* Response Panel */}
      {statusInfo && (
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-400 font-semibold uppercase">Status:</span>
              <span
                className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  statusInfo.status >= 200 && statusInfo.status < 300
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                }`}
              >
                {statusInfo.status} {statusInfo.status === 200 ? "OK" : ""}
              </span>
            </div>
            <div className="text-xs text-zinc-500 font-mono">{statusInfo.duration} ms</div>
          </div>

          <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 font-mono text-xs overflow-x-auto max-h-96">
            {JSON.stringify(responseOutput, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
