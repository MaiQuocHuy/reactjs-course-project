export interface MonthlyData {
  month: string;
  year: number;
  revenue: number;
}

export interface DailyData {
  date: string;
  revenue: number;
  transactions: number;
}

export interface MonthlyRevenue {
  monthlyData: MonthlyData[];
  dailyData: DailyData[];
  availableYears: number[];
}