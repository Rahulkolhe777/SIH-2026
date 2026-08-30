import React, { memo, useEffect } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { WelcomeBanner } from "./WelcomeBanner";
import { MandiKisanCard } from "./MandiKisanCard";
import { TotalBalanceCard } from "./TotalBalanceCard";
import { StatisticsChartCard } from "./StatisticsChartCard";
import { RecentTransactionsCard } from "./RecentTransactionsCard";
import { TopExpensesCard } from "./TopExpensesCard";
import { PaymentScheduleCard } from "./PaymentScheduleCard";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchFarmerProfileThunk } from "../../store/slices/farmerSlice";

interface FarmerDashboardProps {
  userName?: string;
  avatarUrl?: string;
}

export const FarmerDashboard = memo(function FarmerDashboard({
  userName: fallbackName = "Ramesh Patel",
  avatarUrl = "/images/avatar-1.jpg",
}: FarmerDashboardProps) {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user);
  const { profile: farmerProfile, isLoading } = useAppSelector((state) => state.farmer);

  useEffect(() => {
    dispatch(fetchFarmerProfileThunk());
  }, [dispatch]);

  const activeName = farmerProfile?.name || authUser?.name || fallbackName;

  return (
    <div className="min-h-screen w-full bg-[#F5F7F8] font-sans flex flex-col justify-between selection:bg-[#C8F52F] selection:text-[#0B2D1B]">
      {/* Main Full-Screen Content Canvas */}
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 py-5 sm:py-7 flex flex-col flex-1 justify-between">
        <div className="space-y-4 sm:space-y-5">
          {/* 1. Top Header Navigation */}
          <DashboardHeader userName={activeName} avatarUrl={avatarUrl} />

          {/* 2. Welcome Heading & Action Controls */}
          <WelcomeBanner userName={activeName} />

          {/* 3. Main Dashboard Grid (2 Columns, balanced Left & Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 pt-1 items-start">
            
            {/* LEFT COLUMN (lg:col-span-6) */}
            <div className="lg:col-span-6 space-y-5 sm:space-y-6 flex flex-col">
              {/* Top Row: Physical Visa / Kisan Card + Total Balance Card */}
              <div className="flex flex-col sm:flex-row items-stretch gap-4 sm:gap-5">
                <MandiKisanCard
                  cardNumber1="**** 3765"
                  cardNumber2="**** 4329"
                  expiry="09/24"
                />
                <TotalBalanceCard
                  targetBalance={87325.96}
                />
              </div>

              {/* Bottom Row: Recent Transactions */}
              <RecentTransactionsCard />
            </div>

            {/* RIGHT COLUMN (lg:col-span-6) */}
            <div className="lg:col-span-6 space-y-5 sm:space-y-6 flex flex-col">
              {/* Top Row: Statistics SVG Double Line Chart */}
              <StatisticsChartCard />

              {/* Bottom Row: Top Expenses + Payment Schedule side-by-side */}
              <div className="flex flex-col sm:flex-row items-stretch gap-5">
                <TopExpensesCard />
                <PaymentScheduleCard />
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <footer className="w-full pt-8 pb-3 text-center text-xs text-[#8A92A0] select-none">
          Cascade Cloud Ecosystem • Farmer Yield & APMC Mandi Gateway
        </footer>
      </div>
    </div>
  );
});
