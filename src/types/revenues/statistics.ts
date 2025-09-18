export interface StatCard {
  title: string;
  value: string;
}

export interface Statistics {
  stats: StatCard[];
  totalRevenue: string;
  monthlyGrowth: string;
  yearlyGrowth: string;
  avgRevenuePerUser: string;
  totalActiveUsers: number;
  totalTransactions: number;
}