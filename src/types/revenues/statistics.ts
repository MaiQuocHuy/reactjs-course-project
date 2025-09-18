export interface StatCard {
  title: string;
  value: string;
}

export interface Statistics {
  stats: StatCard[];
  totalRevenue: number;
  monthlyGrowth: number;
  yearlyGrowth: number;
  avgRevenuePerUser: number;
  totalActiveUsers: number;
  totalTransactions: number;
}