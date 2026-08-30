export interface TransactionItem {
  id: string;
  merchant: string;
  date: string;
  category: "Subscription" | "Food & Drinks" | "Income" | "Entertainment" | "Agricultural";
  amount: number;
  type: "credit" | "debit";
  logoBg: string;
  logoText: string;
  logoType?: "spotify" | "billa" | "transfer" | "cinema" | "starbucks" | "custom";
}

export interface MonthlyDataPoint {
  month: string;
  income: number;
  expenses: number;
  incomeTooltip: string;
  expensesTooltip: string;
}

export interface ExpenseBarItem {
  day: string;
  value: number;
  isPeak?: boolean;
  tooltip?: string;
}

export interface PaymentScheduleItem {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  isChecked: boolean;
  dateBadgeColor: "yellow" | "gray";
}

export interface DashboardWidget {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}
