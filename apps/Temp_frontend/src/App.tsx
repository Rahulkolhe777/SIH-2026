import React, { useState, useEffect } from "react";
import type { User, MandiSlot, Booking, MandiProfile, DashboardMetrics } from "./types/mandi.types";
import { initialSlots, initialBookings, initialMandiProfile } from "./services/mockData";
import { apiRequest, clearTokens } from "./services/api";
import { Navbar } from "./components/Navbar";
import { Sidebar, type TabType } from "./components/Sidebar";
import { AuthPage } from "./pages/AuthPage";
import { DashboardPage } from "./pages/DashboardPage";
import { SlotsPage } from "./pages/SlotsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { APITesterPage } from "./pages/APITesterPage";
import "./index.css";

export function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem("mandi_current_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Mock vs Live API Mode
  const [useMock, setUseMock] = useState<boolean>(() => {
    try {
      return localStorage.getItem("mandi_use_mock") !== "false";
    } catch {
      return true;
    }
  });

  const [apiConnected, setApiConnected] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");

  // Application Data State with resilient fallbacks
  const [slots, setSlots] = useState<MandiSlot[]>(() => {
    try {
      const saved = localStorage.getItem("mandi_slots_data");
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialSlots;
    } catch {
      return initialSlots;
    }
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem("mandi_bookings_data");
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialBookings;
    } catch {
      return initialBookings;
    }
  });

  const [profile, setProfile] = useState<MandiProfile>(() => {
    try {
      const saved = localStorage.getItem("mandi_profile_data");
      const parsed = saved ? JSON.parse(saved) : null;
      return parsed && typeof parsed === "object"
        ? {
            ...initialMandiProfile,
            ...parsed,
            rating: parsed.rating ?? initialMandiProfile.rating,
            totalReviews: parsed.totalReviews ?? initialMandiProfile.totalReviews,
            legalDocs: Array.isArray(parsed.legalDocs)
              ? parsed.legalDocs
              : initialMandiProfile.legalDocs,
          }
        : initialMandiProfile;
    } catch {
      return initialMandiProfile;
    }
  });

  // Persist State to LocalStorage for seamless dev testing
  useEffect(() => {
    try {
      localStorage.setItem("mandi_slots_data", JSON.stringify(slots));
    } catch (e) {
      console.error(e);
    }
  }, [slots]);

  useEffect(() => {
    try {
      localStorage.setItem("mandi_bookings_data", JSON.stringify(bookings));
    } catch (e) {
      console.error(e);
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem("mandi_profile_data", JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem("mandi_current_user", JSON.stringify(currentUser));
      } else {
        localStorage.removeItem("mandi_current_user");
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem("mandi_use_mock", String(useMock));
    } catch (e) {
      console.error(e);
    }
  }, [useMock]);

  // Ping backend server to test connectivity
  const testBackendConnection = async () => {
    try {
      const res = await apiRequest("/health");
      if (res.status === 200 || res.success) {
        setApiConnected(true);
        return;
      }
      const rawRes = await fetch("http://localhost:4000/health").catch(() => null);
      setApiConnected(rawRes?.status === 200);
    } catch {
      try {
        const rawRes = await fetch("http://localhost:4000/health").catch(() => null);
        setApiConnected(rawRes?.status === 200);
      } catch {
        setApiConnected(false);
      }
    }
  };

  useEffect(() => {
    testBackendConnection();
    const interval = setInterval(testBackendConnection, 15000);
    return () => clearInterval(interval);
  }, []);

  // Compute live dashboard metrics safely
  const todayStr = (new Date().toISOString().split("T")[0] as string) || "2026-08-30";
  const safeSlots = Array.isArray(slots) ? slots : [];
  const safeBookings = Array.isArray(bookings) ? bookings : [];

  const todaySlots = safeSlots.filter((s) => s.date === todayStr);
  const activeBookingsCount = safeBookings.filter((b) =>
    ["PENDING", "ACCEPTED", "ARRIVED", "VERIFIED"].includes(b.status)
  ).length;
  const arrivalsTodayCount = safeBookings.filter(
    (b) => b.slotDate === todayStr && ["ARRIVED", "VERIFIED", "COMPLETED"].includes(b.status)
  ).length;
  const completedTodayCount = safeBookings.filter(
    (b) => b.slotDate === todayStr && b.status === "COMPLETED"
  ).length;
  const pendingApprovalsCount = safeBookings.filter((b) => b.status === "PENDING").length;

  const totalCap = safeSlots.reduce((sum, s) => sum + (Number(s.totalCapacityQuintals) || 0), 0);
  const bookedCap = safeSlots.reduce((sum, s) => sum + (Number(s.bookedCapacityQuintals) || 0), 0);
  const totalCapacityPercentage = totalCap > 0 ? (bookedCap / totalCap) * 100 : 0;

  const metrics: DashboardMetrics = {
    totalSlotsToday: todaySlots.length > 0 ? todaySlots.length : safeSlots.length,
    activeBookings: activeBookingsCount,
    arrivalsToday: arrivalsTodayCount,
    completedToday: completedTodayCount,
    pendingApprovals: pendingApprovalsCount,
    totalCapacityUtilizedPercentage: Number(totalCapacityPercentage.toFixed(1)),
  };

  // Auth Handlers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setActiveTab("dashboard");
  };

  const handleLogout = () => {
    clearTokens();
    setCurrentUser(null);
  };

  // Booking Handlers
  const handleUpdateBookingStatus = (
    id: string,
    status: Booking["status"],
    notes?: string
  ) => {
    setBookings((prev) =>
      (prev || []).map((b) => {
        if (b.id !== id) return b;
        return {
          ...b,
          status,
          notes: notes || b.notes,
          verifiedAt: status === "VERIFIED" ? new Date().toISOString() : b.verifiedAt,
          completedAt: status === "COMPLETED" ? new Date().toISOString() : b.completedAt,
        };
      })
    );
  };

  const handleQuickVerifyToken = (tokenOrId: string) => {
    const q = (tokenOrId || "").toLowerCase();
    const found = (bookings || []).find(
      (b) => (b.token || "").toLowerCase() === q || (b.id || "").toLowerCase() === q
    );
    return { found: !!found, booking: found };
  };

  // Slot Handlers
  const handleCreateSlot = (
    newSlotData: Omit<
      MandiSlot,
      "id" | "bookedCapacityQuintals" | "capacityPercentage" | "bookedFarmers" | "availableBookings"
    >
  ) => {
    const id = `slot-${Math.floor(100 + Math.random() * 900)}`;
    const newSlot: MandiSlot = {
      ...newSlotData,
      id,
      bookedCapacityQuintals: 0,
      capacityPercentage: 0,
      bookedFarmers: 0,
      availableBookings: newSlotData.maxFarmers,
      isActive: true,
    };
    setSlots((prev) => [newSlot, ...(prev || [])]);
  };

  const handleUpdateSlot = (id: string, updated: Partial<MandiSlot>) => {
    setSlots((prev) =>
      (prev || []).map((s) => {
        if (s.id !== id) return s;
        const total = updated.totalCapacityQuintals ?? s.totalCapacityQuintals;
        const booked = updated.bookedCapacityQuintals ?? s.bookedCapacityQuintals;
        const pct = total > 0 ? (booked / total) * 100 : 0;
        const maxF = updated.maxFarmers ?? s.maxFarmers;
        const bookedF = updated.bookedFarmers ?? s.bookedFarmers;

        return {
          ...s,
          ...updated,
          capacityPercentage: Number(pct.toFixed(1)),
          availableBookings: Math.max(0, maxF - bookedF),
        };
      })
    );
  };

  const handleDeleteSlot = (id: string) => {
    // Cascade cancel/reject all bookings associated with deleted slot
    setBookings((prev) =>
      (prev || []).map((b) => {
        if (b.slotId === id && b.status !== "COMPLETED") {
          return {
            ...b,
            status: "CANCELLED" as const,
            notes: "Slot cancelled by Mandi Operator.",
          };
        }
        return b;
      })
    );
    setSlots((prev) => (prev || []).filter((s) => s.id !== id));
  };

  const handleApplyDefaultSlotsPreset = () => {
    const tomorrow = (new Date(Date.now() + 86400000).toISOString().split("T")[0] as string) || "2026-08-31";
    const presets: MandiSlot[] = [
      {
        id: `slot-${Math.floor(100 + Math.random() * 900)}`,
        crop: "Wheat (Sharbati)",
        date: tomorrow,
        startTime: "08:00",
        endTime: "11:30",
        totalCapacityQuintals: 600,
        bookedCapacityQuintals: 0,
        capacityPercentage: 0,
        maxFarmers: 25,
        bookedFarmers: 0,
        availableBookings: 25,
        bufferMinutes: 15,
        bufferPercentage: 10,
        isActive: true,
      },
      {
        id: `slot-${Math.floor(100 + Math.random() * 900)}`,
        crop: "Mustard (Sarson)",
        date: tomorrow,
        startTime: "12:00",
        endTime: "15:30",
        totalCapacityQuintals: 400,
        bookedCapacityQuintals: 0,
        capacityPercentage: 0,
        maxFarmers: 18,
        bookedFarmers: 0,
        availableBookings: 18,
        bufferMinutes: 20,
        bufferPercentage: 10,
        isActive: true,
      },
    ];
    setSlots((prev) => [...presets, ...(prev || [])]);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        user={currentUser}
        useMock={useMock}
        onToggleMock={() => setUseMock((prev) => !prev)}
        onLogout={handleLogout}
        apiConnected={apiConnected}
        onTestConnection={testBackendConnection}
      />

      {/* Main Container */}
      {!currentUser ? (
        <AuthPage onLoginSuccess={handleLoginSuccess} useMock={useMock} />
      ) : (
        <div className="flex-1 flex flex-col md:flex-row">
          {/* Sidebar */}
          <Sidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            pendingCount={pendingApprovalsCount}
          />

          {/* Main Content Area */}
          <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
            {activeTab === "dashboard" && (
              <DashboardPage
                bookings={safeBookings}
                slots={safeSlots}
                metrics={metrics}
                isApproved={currentUser?.approvalStatus === "APPROVED"}
                approvalStatus={currentUser?.approvalStatus || "PENDING_ONBOARDING"}
                onGoToSettings={() => setActiveTab("settings")}
                onUpdateBookingStatus={handleUpdateBookingStatus}
                onQuickVerifyToken={handleQuickVerifyToken}
                onApplyDefaultSlotsPreset={handleApplyDefaultSlotsPreset}
              />
            )}

            {activeTab === "slots" && (
              <SlotsPage
                slots={safeSlots}
                onCreateSlot={handleCreateSlot}
                onUpdateSlot={handleUpdateSlot}
                onDeleteSlot={handleDeleteSlot}
              />
            )}

            {activeTab === "settings" && (
              <SettingsPage profile={profile} onUpdateProfile={setProfile} />
            )}

            {activeTab === "api-tester" && <APITesterPage />}
          </main>
        </div>
      )}
    </div>
  );
}

export default App;
