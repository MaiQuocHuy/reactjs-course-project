import { useEffect, useState } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  Award,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import {
  useGetComparativeAnalysisQuery,
  useGetAvailableYearsQuery,
} from '../../services/revenuesApi';

const currentYear = new Date().getFullYear();

const ComparativeAnalysisComponent: React.FC = () => {
  const [selectedComparison, setSelectedComparison] = useState<
    'monthly' | 'quarterly' | 'yearly'
  >('monthly');
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  // API calls
  const {
    data: availableYears,
    isLoading: yearsLoading,
    error: yearsError,
  } = useGetAvailableYearsQuery();
  const {
    data: comparativeData,
    isLoading: comparisonLoading,
    error: comparisonError,
  } = useGetComparativeAnalysisQuery({
    period: selectedComparison,
    year: selectedComparison !== 'yearly' ? selectedYear : undefined,
  });

  // Update selected year when available years are loaded
  useEffect(() => {
    if (availableYears && availableYears.length > 0) {
      const latestYear = Math.max(...availableYears);
      setSelectedYear(latestYear);
    }
  }, [availableYears]);

  const isLoading = yearsLoading || comparisonLoading;
  const hasError = yearsError || comparisonError;

  // Extract data from API response
  const comparisonData = comparativeData?.comparisons || [];
  const bestPeriod = comparativeData?.bestPerformingPeriod;
  const worstPeriod = comparativeData?.worstPerformingPeriod;

  // Check if we have enough data for comparison
  const hasEnoughData = comparisonData.length > 0 && comparativeData;

  // For growth line visibility - always show for now since API handles the logic
  const shouldShowGrowthLine = () => true;

  const formatValue = (value: number) => {
    return `$${(value / 1000).toFixed(0)}k`;
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Loading Comparative Analysis
                </h3>
                <p className="text-gray-600">
                  Fetching revenue comparison data...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error state
  if (hasError) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-red-100 rounded-full">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Error Loading Data
                </h3>
                <p className="text-gray-600">
                  Failed to load comparative analysis data. Please try again
                  later.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Comparative Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Comparison Type:</label>
              <Select
                value={selectedComparison}
                onValueChange={(value: 'monthly' | 'quarterly' | 'yearly') =>
                  setSelectedComparison(value)
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedComparison !== 'yearly' && (
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Year:</label>
                <Select
                  value={selectedYear.toString()}
                  onValueChange={(value) => setSelectedYear(parseInt(value))}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
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
            )}
          </div>
        </CardContent>
      </Card>

      {/* Check if we have enough data for comparison */}
      {!hasEnoughData ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-yellow-100 rounded-full">
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Don't have enough data
                </h3>
                <p className="text-gray-600">
                  {selectedComparison === 'yearly'
                    ? 'At least 2 years of data are required for yearly comparison.'
                    : `Previous year data (${
                        selectedYear - 1
                      }) is not available for comparison.`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Performance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Best Performing Period */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Best Performing Period
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {bestPeriod?.period}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-green-600 font-medium">
                        +{bestPeriod?.growth.toFixed(1)}%
                      </span>
                      <span className="text-gray-500 text-sm">growth</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Worst Performing Period */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-full">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Worst Performing Period
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {worstPeriod?.period}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingDown className="h-4 w-4 text-red-600" />
                      <span className="text-red-600 font-medium">
                        {worstPeriod?.growth.toFixed(1)}%
                      </span>
                      <span className="text-gray-500 text-sm">growth</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Comparison Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {selectedComparison.charAt(0).toUpperCase() +
                  selectedComparison.slice(1)}{' '}
                Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis
                      yAxisId="revenue"
                      orientation="left"
                      tickFormatter={formatValue}
                    />
                    {shouldShowGrowthLine() && (
                      <YAxis
                        yAxisId="growth"
                        orientation="right"
                        tickFormatter={(value) => `${value}%`}
                      />
                    )}
                    <Tooltip
                      formatter={(value: number, name: string) => {
                        if (name === 'current' || name === 'previous') {
                          return [
                            `$${(value / 1000).toFixed(0)}k`,
                            name === 'current'
                              ? 'Current Period'
                              : 'Previous Period',
                          ];
                        }
                        return [`${value.toFixed(1)}%`, 'Growth Rate'];
                      }}
                    />

                    {/* Revenue bars */}
                    <Bar
                      yAxisId="revenue"
                      dataKey="previous"
                      fill="#94a3b8"
                      name="previous"
                    />
                    <Bar
                      yAxisId="revenue"
                      dataKey="current"
                      fill="#3b82f6"
                      name="current"
                    />

                    {/* Growth line - only show when we have more than 2 years for yearly comparison */}
                    {shouldShowGrowthLine() && (
                      <Line
                        yAxisId="growth"
                        type="monotone"
                        dataKey="growth"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ fill: '#10b981', r: 5 }}
                        name="growth"
                      />
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Comparison Table</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 p-3 text-left">
                        Period
                      </th>
                      <th className="border border-gray-200 p-3 text-center">
                        Current Revenue
                      </th>
                      <th className="border border-gray-200 p-3 text-center">
                        Previous Revenue
                      </th>
                      {shouldShowGrowthLine() && (
                        <th className="border border-gray-200 p-3 text-center">
                          Growth
                        </th>
                      )}
                      <th className="border border-gray-200 p-3 text-center">
                        Total Transactions
                      </th>
                      <th className="border border-gray-200 p-3 text-center">
                        Total Previous Transactions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((period, index) => (
                      <tr
                        key={period.period}
                        className={`${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        <td className="border border-gray-200 p-3 font-medium">
                          {period.period}
                        </td>
                        <td className="border border-gray-200 p-3 text-center font-mono">
                          ${(period.current / 1000).toFixed(0)}k
                        </td>
                        <td className="border border-gray-200 p-3 text-center font-mono text-gray-600">
                          ${(period.previous / 1000).toFixed(0)}k
                        </td>
                        {shouldShowGrowthLine() && (
                          <td
                            className={`border border-gray-200 p-3 text-center font-medium ${
                              period.growth >= 0
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            <div className="flex items-center justify-end gap-1">
                              {period.growth >= 0 ? (
                                <TrendingUp className="h-4 w-4" />
                              ) : (
                                <TrendingDown className="h-4 w-4" />
                              )}
                              {period.growth > 0 ? '+' : ''}
                              {period.growth.toFixed(1)}%
                            </div>
                          </td>
                        )}
                        <td className="border border-gray-200 p-3 text-center font-mono">
                          {period.transactions}
                        </td>
                        <td className="border border-gray-200 p-3 text-center font-mono">
                          {period.previousTransactions}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ComparativeAnalysisComponent;
