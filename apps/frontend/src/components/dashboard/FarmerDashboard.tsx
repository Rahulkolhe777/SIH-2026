import React, { memo } from "react";
import { BrowserChrome } from "./BrowserChrome";
import { DashboardHeader } from "./DashboardHeader";
import { WelcomeBanner } from "./WelcomeBanner";
import { MandiKisanCard } from "./MandiKisanCard";
import { TotalBalanceCard } from "./TotalBalanceCard";
import { StatisticsChartCard } from "./StatisticsChartCard";
import { RecentTransactionsCard } from "./RecentTransactionsCard";
import { TopExpensesCard } from "./TopExpensesCard";
import { PaymentScheduleCard } from "./PaymentScheduleCard";

interface FarmerDashboardProps {
  userName?: string;
  avatarUrl?: string;
}

export const FarmerDashboard = memo(function FarmerDashboard({
  userName = "Jane",
  avatarUrl = "/images/avatar-1.jpg",
}: FarmerDashboardProps) {
  return (
    <div className="min-h-screen w-full bg-[#D9D8E0] py-4 sm:py-6 md:py-8 px-2 sm:px-4 md:px-8 flex items-center justify-center font-sans">
      {/* Centered Desktop Browser Window (~92% viewport width, max 1520px) */}
      <div className="w-full max-w-[1520px] bg-white rounded-[12px] shadow-2xl overflow-hidden border border-[#C5CAD2]/60 flex flex-col min-h-[90vh]">
        {/* 1. Browser Chrome Frame */}
        <BrowserChrome url="cascade.com/farmer/dashboard" />

        {/* 2. Application Canvas (#F5F7F8) */}
        <div className="flex-1 bg-[#F5F7F8] px-5 sm:px-8 md:px-10 lg:px-12 py-5 sm:py-6 flex flex-col justify-between">
          <div>
            {/* 3. Top Header Navigation */}
            <DashboardHeader userName={userName} avatarUrl={avatarUrl} />

            {/* 4. Welcome Heading & Action Controls */}
            <WelcomeBanner userName={userName} />

            {/* 5. Main Dashboard Grid (2 Columns, ~48% Left, ~49% Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 pt-2 items-start">
              
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

          {/* SaaS Footer watermark */}
          <footer className="w-full pt-8 pb-2 text-center text-xs text-[#8A92A0] select-none">
            Cascade Cloud Ecosystem • Farmer Yield & APMC Mandi Gateway
          </footer>
        </div>
      </div>
    </div>
  );
});
