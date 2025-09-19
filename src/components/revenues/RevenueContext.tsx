import React from 'react';

export interface FilterState {
  category: string;
  instructor: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  timeFrame: 'daily' | 'monthly' | 'quarterly' | 'yearly';
}

export interface RevenueContextType {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  selectedPeriod: string;
  setSelectedPeriod: React.Dispatch<React.SetStateAction<string>>;
  selectedYear: number;
  setSelectedYear: React.Dispatch<React.SetStateAction<number>>;
  drillDownData: any;
  setDrillDownData: React.Dispatch<React.SetStateAction<any>>;
}

const RevenueContext = React.createContext<RevenueContextType | undefined>(undefined);

export const useRevenueContext = () => {
  const context = React.useContext(RevenueContext);
  if (!context) {
    throw new Error('useRevenueContext must be used within a RevenueProvider');
  }
  return context;
};

export const RevenueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = React.useState<FilterState>({
    category: 'all',
    instructor: 'all',
    dateRange: {
      startDate: '',
      endDate: ''
    },
    timeFrame: 'monthly'
  });
  
  const [selectedPeriod, setSelectedPeriod] = React.useState<string>('');
  const [selectedYear, setSelectedYear] = React.useState<number>(2025);
  const [drillDownData, setDrillDownData] = React.useState<any>(null);

  const value: RevenueContextType = {
    filters,
    setFilters,
    selectedPeriod,
    setSelectedPeriod,
    selectedYear,
    setSelectedYear,
    drillDownData,
    setDrillDownData
  };

  return (
    <RevenueContext.Provider value={value}>
      {children}
    </RevenueContext.Provider>
  );
};