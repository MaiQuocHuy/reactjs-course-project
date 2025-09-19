import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Skeleton } from '../../ui/skeleton';

interface MonthlyRevenueChartProps {
  currentYearData: Array<{
    month: string;
    revenue: number;
  }>;
  selectedYear: number;
  isLoading: boolean;
  error: any;
  onChartClick: (data: any) => void;
  formatValue: (value: number) => string;
}

const MonthlyRevenueChart: React.FC<MonthlyRevenueChartProps> = ({
  currentYearData,
  selectedYear,
  isLoading,
  error,
  onChartClick,
  formatValue,
}) => {
  if (error) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-medium">
            Failed to load revenue data
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-80">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={currentYearData} onClick={onChartClick}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={formatValue} />
          <Tooltip
            formatter={(value: number) => [
              `$${(value / 1000).toFixed(0)}k`,
              'Revenue',
            ]}
            labelFormatter={(label) => `${label} ${selectedYear}`}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: '#3b82f6', r: 6 }}
            activeDot={{ r: 8, fill: '#1d4ed8' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyRevenueChart;