export interface SeasonalData {
  month: string;
  day: number;
  revenue: string;
  date: string;
  transactions: number;
}

export interface SeasonalSummary {
  season: string;
  totalRevenue: string;
  averageDailyRevenue: string;
  totalDays: number;
}

export interface SeasonalHeatmap {
  dailyData: SeasonalData[];
  seasonalSummary: SeasonalSummary[];
  minRevenue: string;
  maxRevenue: string;
  year: number;
}