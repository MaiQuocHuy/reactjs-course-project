export interface ComparisonData {
  period: string;
  current: number;
  previous: number;
  growth: number;
  transactions: number;
  previousTransactions: number;
}

export interface BestWorstPeriod {
  period: string;
  growth: number;
}

export interface ComparativeAnalysis {
  comparisonType: string;
  selectedYear: number;
  comparisons: ComparisonData[];
  bestPerformingPeriod: BestWorstPeriod;
  worstPerformingPeriod: BestWorstPeriod;
  availableYears: number[];
}