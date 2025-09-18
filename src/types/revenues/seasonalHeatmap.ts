export interface SeasonalData {
  month: string;
  day: number;
  revenue: number;
  date: string;
  transactions: number;
}

export interface SeasonalSummary {
  season: string;
  totalRevenue: number;
  averageDailyRevenue: number;
  totalDays: number;
}

export interface SeasonalHeatmap {
  dailyData: SeasonalData[];
  seasonalSummary: SeasonalSummary[];
  minRevenue: number;
  maxRevenue: number;
  year: number;
}