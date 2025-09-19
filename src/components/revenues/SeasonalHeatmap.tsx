import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Thermometer, Calendar } from 'lucide-react';
import {
  useGetDailyRevenueQuery,
  useGetAvailableYearsQuery,
} from '@/services/revenuesApi';

const currentYear = new Date().getFullYear();

const SeasonalHeatmap: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const monthNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  // Get available years
  const { data: availableYears, isLoading: yearsLoading } =
    useGetAvailableYearsQuery();

  // Get daily revenue for each month
  const monthlyQueries = monthNumbers.map((month) =>
    useGetDailyRevenueQuery({ year: selectedYear, month })
  );

  // Combine all daily data and transform to match the expected format
  const combinedData = useMemo(() => {
    const allData: Array<{
      month: string;
      day: number;
      revenue: number;
      date: string;
    }> = [];

    monthlyQueries.forEach((query, index) => {
      if (query.data) {
        query.data.forEach((dailyData) => {
          const date = new Date(dailyData.date);
          allData.push({
            month: months[index],
            day: date.getDate(),
            revenue: dailyData.revenue,
            date: dailyData.date,
          });
        });
      }
    });

    return allData;
  }, [monthlyQueries, months]);

  // Check if any query is loading
  const isLoading =
    monthlyQueries.some((query) => query.isLoading) || yearsLoading;

  // Check if any query has error
  const hasError = monthlyQueries.some((query) => query.error);

  // Calculate revenue ranges for color mapping
  const allRevenues = combinedData.map((d) => d.revenue);
  const minRevenue = allRevenues.length > 0 ? Math.min(...allRevenues) : 0;
  const maxRevenue = allRevenues.length > 0 ? Math.max(...allRevenues) : 0;

  const getColorIntensity = (revenue: number) => {
    const normalized = (revenue - minRevenue) / (maxRevenue - minRevenue);
    return normalized;
  };

  const getColorClass = (intensity: number) => {
    if (intensity < 0.2) return 'bg-blue-100';
    if (intensity < 0.4) return 'bg-blue-200';
    if (intensity < 0.6) return 'bg-blue-300';
    if (intensity < 0.8) return 'bg-blue-400';
    if (intensity < 1) return 'bg-blue-500';
    return 'bg-blue-600';
  };

  const getTextColorClass = (intensity: number) => {
    return intensity > 0.6 ? 'text-white' : 'text-gray-700';
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Thermometer className="h-5 w-5" />
            <div>
              <CardTitle>Seasonal Revenue Heatmap</CardTitle>
              <p className="text-sm text-gray-600">
                Daily revenue patterns throughout the year
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <Select
              value={selectedYear.toString()}
              onValueChange={(value) => setSelectedYear(parseInt(value))}
              disabled={yearsLoading}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {availableYears?.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {hasError && (
          <div className="flex items-center justify-center h-64">
            <p className="text-red-500">Error loading revenue data</p>
          </div>
        )}

        {!isLoading && !hasError && (
          <>
            <div className="space-y-2">
              {months.map((month) => {
                const monthData = combinedData.filter((d) => d.month === month);
                const daysInMonth = monthData.length;

                return (
                  <div key={month} className="flex items-center">
                    <div className="w-12 text-sm font-medium text-gray-600">
                      {month}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.from({ length: daysInMonth }, (_, dayIndex) => {
                        const dayData = monthData[dayIndex];
                        if (!dayData) return null;

                        const intensity = getColorIntensity(dayData.revenue);

                        return (
                          <div
                            key={`${month}-${dayIndex + 1}`}
                            className={`
                              w-6 h-6 text-xs flex items-center justify-center
                              rounded-sm cursor-pointer transition-transform hover:scale-110
                              ${getColorClass(intensity)} ${getTextColorClass(
                              intensity
                            )}
                            `}
                            title={`${month} ${dayIndex + 1}: $${(
                              dayData.revenue / 1000
                            ).toFixed(1)}k`}
                          >
                            {dayIndex + 1}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Less</span>
                <div className="flex gap-1">
                  <div className="w-4 h-4 bg-blue-100 rounded-sm"></div>
                  <div className="w-4 h-4 bg-blue-200 rounded-sm"></div>
                  <div className="w-4 h-4 bg-blue-300 rounded-sm"></div>
                  <div className="w-4 h-4 bg-blue-400 rounded-sm"></div>
                  <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
                  <div className="w-4 h-4 bg-blue-600 rounded-sm"></div>
                </div>
                <span className="text-sm text-gray-600">More</span>
              </div>
              {allRevenues.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border">
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    Range:
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      ${(minRevenue / 1000).toFixed(1)}k
                    </span>
                    <span className="text-gray-400">—</span>
                    <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      ${(maxRevenue / 1000).toFixed(1)}k
                    </span>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SeasonalHeatmap;
