import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../ui/card';
import {
  useGetAvailableYearsQuery,
  useGetMonthlyRevenueQuery,
  useGetDailyRevenueQuery,
} from '@/services/revenuesApi';
import { useRevenueContext } from '../RevenueContext';
import MonthlyRevenueHeader from './MonthlyRevenueHeader';
import MonthlyRevenueChart from './MonthlyRevenueChart';
import DailyRevenueCard from './DailyRevenueCard';

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const MonthlyRevenue: React.FC = () => {
  const { selectedPeriod, setSelectedPeriod, selectedYear, setSelectedYear } =
    useRevenueContext();

  // Local state for drill-down data (not shared with other components)
  const [dailyRevenue, setDailyRevenue] = useState<any>(null);
  const [selectedMonthForDaily, setSelectedMonthForDaily] = useState<
    number | null
  >(null);

  // API calls
  const { data: availableYears = [] } = useGetAvailableYearsQuery();
  const {
    data: monthlyRevenueData,
    isLoading: monthlyLoading,
    error: monthlyError,
  } = useGetMonthlyRevenueQuery({ year: selectedYear });
  const {
    data: dailyRevenueData,
    isLoading: dailyLoading,
    error: dailyError,
  } = useGetDailyRevenueQuery(
    { year: selectedYear, month: selectedMonthForDaily! },
    { skip: selectedMonthForDaily === null }
  );

  // Get data for selected year only (API already filters by year)
  const currentYearData = monthlyRevenueData?.monthlyData || [];

  // Update drill-down data when daily data is loaded
  useEffect(() => {
    if (dailyRevenueData && selectedMonthForDaily && selectedPeriod) {
      // Ensure the data corresponds to the currently selected month and year
      const clickedMonth = monthNames[selectedMonthForDaily - 1];
      if (selectedPeriod !== `${clickedMonth} ${selectedYear}`) {
        return; // Stale data, do not update state
      }

      setDailyRevenue({
        period: `${clickedMonth} ${selectedYear}`,
        type: 'daily',
        data: dailyRevenueData || [],
      });
    }
  }, [dailyRevenueData, selectedMonthForDaily, selectedPeriod, selectedYear]);

  const handleChartClick = (data: any) => {
    // console.log(data);

    if (data && data.activePayload && data.activePayload[0].payload.month) {
      const clickedMonth = data.activePayload[0].payload.month;
      setSelectedPeriod(`${clickedMonth} ${selectedYear}`);

      // Convert month name to number for API call

      const monthNumber = monthNames.indexOf(clickedMonth) + 1;
      setSelectedMonthForDaily(monthNumber);
    }
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(parseInt(year));
    // Clear selected period and drill-down data when year changes
    setSelectedPeriod('');
    setDailyRevenue(null);
    setSelectedMonthForDaily(null);
  };

  const formatValue = (value: number) => {
    return `$${(value / 1000).toFixed(0)}k`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <MonthlyRevenueHeader
          selectedYear={selectedYear}
          selectedPeriod={selectedPeriod}
          availableYears={availableYears}
          onYearChange={handleYearChange}
        />
        <CardContent>
          <MonthlyRevenueChart
            currentYearData={currentYearData}
            selectedYear={selectedYear}
            isLoading={monthlyLoading}
            error={monthlyError}
            onChartClick={handleChartClick}
            formatValue={formatValue}
          />
        </CardContent>
      </Card>

      {/* Daily Data Display */}
      {dailyRevenue && (
        <DailyRevenueCard
          drillDownData={dailyRevenue}
          isLoading={dailyLoading}
          error={dailyError}
          onClose={() => {
            setDailyRevenue(null);
            setSelectedPeriod('');
            setSelectedMonthForDaily(null);
          }}
          formatValue={formatValue}
        />
      )}
    </div>
  );
};

export default MonthlyRevenue;
