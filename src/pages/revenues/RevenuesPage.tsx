import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useAppSelector } from '../../hooks/redux';

type Props = {};

const RevenuesPage: React.FC<Props> = () => {
  const [tab, setTab] = useState<'monthly' | 'yearly'>('monthly');
  const { payments } = useAppSelector((state) => state.payments);

  // Extract available years from payment data
  const availableYears = useMemo(() => {
    if (!payments || payments.length === 0) return [new Date().getFullYear()];

    const years = payments
      .map((payment) => {
        if (!payment.createdAt) return null;
        const date = new Date(String(payment.createdAt));
        return date.getFullYear();
      })
      .filter((year): year is number => year !== null)
      .reduce((unique: number[], year) => {
        if (!unique.includes(year)) {
          unique.push(year);
        }
        return unique;
      }, [])
      .sort();

    // If no valid years found, use current year
    return years.length > 0 ? years : [new Date().getFullYear()];
  }, [payments]);

  // State for UI controls
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [startMonth, setStartMonth] = useState<number>(1);
  const [endMonth, setEndMonth] = useState<number>(12);
  const [startYear, setStartYear] = useState<number>(
    availableYears.length > 0 ? availableYears[0] : new Date().getFullYear()
  );
  const [endYear, setEndYear] = useState<number>(
    availableYears.length > 0
      ? availableYears[availableYears.length - 1]
      : new Date().getFullYear()
  );

  // Update year selections when available years change
  React.useEffect(() => {
    if (availableYears.length > 0) {
      setStartYear(availableYears[0]);
      setEndYear(availableYears[availableYears.length - 1]);
    }
  }, [availableYears]);

  // Calculate total revenue
  const totalRevenue = useMemo(() => {
    if (!payments || payments.length === 0) return 0;

    return (
      payments.reduce((acc, payment) => {
        return acc + (payment.amount || 0);
      }, 0) * 0.3
    ); // Platform gets 30% of payment
  }, [payments]);

  // Generate yearly revenue data
  const yearlyData = useMemo(() => {
    if (!payments || payments.length === 0) {
      return {};
    }

    const yearlyRevenue: Record<number, number[]> = {};

    // Initialize with zeros for all years and months
    availableYears.forEach((year) => {
      yearlyRevenue[year] = Array(12).fill(0);
    });

    // Fill in the actual revenue data
    payments.forEach((payment) => {
      if (!payment.createdAt || !payment.amount) return;

      const date = new Date(String(payment.createdAt));
      const year = date.getFullYear();
      const month = date.getMonth();

      if (yearlyRevenue[year]) {
        yearlyRevenue[year][month] += payment.amount * 0.3; // 30% platform fee
      }
    });

    return yearlyRevenue;
  }, [payments, availableYears]);

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

  // Helper to render a monthly comparison chart
  const MonthlyComparisonChart: React.FC = () => {
    const chartData = months.map((month, index) => {
      const monthData: Record<string, any> = { name: month };

      if (selectedYear === 'all') {
        // Show all years in comparison
        availableYears.forEach((year) => {
          if (yearlyData[year]) {
            monthData[`${year}`] = yearlyData[year][index];
          }
        });
      } else {
        // Show only selected year
        const year = Number(selectedYear);
        if (yearlyData[year]) {
          monthData.value = yearlyData[year][index];
        } else {
          monthData.value = 0;
        }
      }

      return monthData;
    });

    return (
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Revenue']}
            />
            {selectedYear === 'all' ? (
              // Render bars for each year with different colors
              availableYears.map((year, idx) => (
                <Bar
                  key={year}
                  dataKey={`${year}`}
                  name={`${year}`}
                  fill={`hsl(${210 + idx * 30}, 80%, 55%)`}
                />
              ))
            ) : (
              <Bar dataKey="value" fill="#3b82f6" />
            )}
            {selectedYear === 'all' && (
              <Legend verticalAlign="top" height={36} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // Helper to render yearly comparison chart
  const YearlyComparisonChart: React.FC = () => {
    // Filter years between start and end year
    const filteredYears = availableYears.filter(
      (year) => year >= startYear && year <= endYear
    );

    // Calculate yearly totals
    const chartData = filteredYears.map((year) => {
      const yearTotal = yearlyData[year]
        ? yearlyData[year].reduce((sum, monthValue) => sum + monthValue, 0)
        : 0;

      return {
        name: `${year}`,
        value: yearTotal,
      };
    });

    return (
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value) => [
                `$${Number(value).toFixed(2)}`,
                'Total Revenue',
              ]}
            />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Revenue Statistics
          </h1>
          <p className="text-muted-foreground">
            Overview and detailed revenue charts
          </p>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold">Total Revenue</div>
          <div className="text-2xl font-extrabold">
            $
            {totalRevenue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          {availableYears.length > 1 && (
            <div className="space-x-2">
              <Button
                variant={tab === 'monthly' ? 'default' : 'ghost'}
                onClick={() => setTab('monthly')}
              >
                Monthly by Year
              </Button>
              <Button
                variant={tab === 'yearly' ? 'default' : 'ghost'}
                onClick={() => setTab('yearly')}
              >
                Yearly Comparison
              </Button>
            </div>
          )}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              {tab === 'monthly' && (
                <>
                  {availableYears.length > 1 && (
                    <>
                      <label className="text-sm">Year:</label>
                      <select
                        className="border rounded px-2 py-1"
                        value={selectedYear}
                        onChange={(e) =>
                          setSelectedYear(
                            e.target.value === 'all'
                              ? 'all'
                              : Number(e.target.value)
                          )
                        }
                      >
                        <option value="all">All years</option>
                        {availableYears.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </>
                  )}

                  <label className="text-sm">Months:</label>
                  <select
                    className="border rounded px-2 py-1"
                    value={startMonth}
                    onChange={(e) => setStartMonth(Number(e.target.value))}
                  >
                    {months.map((m, i) => (
                      <option key={i} value={i + 1}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <span>to</span>
                  <select
                    className="border rounded px-2 py-1"
                    value={endMonth}
                    onChange={(e) => setEndMonth(Number(e.target.value))}
                  >
                    {months.map((m, i) => (
                      <option key={i} value={i + 1}>
                        {m}
                      </option>
                    ))}
                  </select>
                </>
              )}

              {tab === 'yearly' && (
                <>
                  <label className="text-sm">From</label>
                  <select
                    className="border rounded px-2 py-1"
                    value={startYear}
                    onChange={(e) => setStartYear(Number(e.target.value))}
                  >
                    {availableYears.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                  <label className="text-sm">to</label>
                  <select
                    className="border rounded px-2 py-1"
                    value={endYear}
                    onChange={(e) => setEndYear(Number(e.target.value))}
                  >
                    {availableYears.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {tab === 'monthly' && (
            <div>
              <div className="mb-4">
                <div className="font-medium">Monthly revenue</div>
                <div className="text-sm text-muted-foreground">
                  {selectedYear === 'all'
                    ? 'Compare revenue across all years for each month'
                    : `Revenue distribution across months for ${selectedYear}`}
                </div>
              </div>
              {!payments || payments.length === 0 ? (
                <div className="flex items-center justify-center h-64 bg-muted/20 rounded-lg">
                  <p className="text-muted-foreground">
                    No payment data available
                  </p>
                </div>
              ) : (
                <MonthlyComparisonChart />
              )}
            </div>
          )}

          {tab === 'yearly' && (
            <div>
              <div className="mb-4">
                <div className="font-medium">Yearly revenue</div>
                <div className="text-sm text-muted-foreground">
                  Compare total revenue between years {startYear} - {endYear}
                </div>
              </div>
              {!payments || payments.length === 0 ? (
                <div className="flex items-center justify-center h-64 bg-muted/20 rounded-lg">
                  <p className="text-muted-foreground">
                    No payment data available
                  </p>
                </div>
              ) : (
                <YearlyComparisonChart />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional data insights */}
      {payments && payments.length > 0 && (
        <Card>
          <CardHeader>
            <div className="font-medium">Revenue Insights</div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Highest revenue month */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="text-sm font-medium text-blue-700">
                  Highest Revenue Month
                </div>
                {(() => {
                  // Find highest month across all years
                  let highestMonth = { month: 0, year: 0, amount: 0 };

                  Object.entries(yearlyData).forEach(([year, monthValues]) => {
                    monthValues.forEach((amount, month) => {
                      if (amount > highestMonth.amount) {
                        highestMonth = { month, year: Number(year), amount };
                      }
                    });
                  });

                  return highestMonth.amount > 0 ? (
                    <div>
                      <div className="mt-1 text-lg font-bold">
                        {months[highestMonth.month]} {highestMonth.year}
                      </div>
                      <div className="text-sm text-blue-600">
                        $
                        {highestMonth.amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      No data available
                    </div>
                  );
                })()}
              </div>

              {/* Year-over-year growth */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="text-sm font-medium text-green-700">
                  Year-over-Year Growth
                </div>
                {(() => {
                  const currentYear = new Date().getFullYear();
                  const lastYear = currentYear - 1;

                  if (!yearlyData[currentYear] || !yearlyData[lastYear]) {
                    return (
                      <div className="text-sm text-muted-foreground">
                        Insufficient data
                      </div>
                    );
                  }

                  const currentYearTotal = yearlyData[currentYear].reduce(
                    (sum, val) => sum + val,
                    0
                  );
                  const lastYearTotal = yearlyData[lastYear].reduce(
                    (sum, val) => sum + val,
                    0
                  );

                  if (lastYearTotal === 0)
                    return (
                      <div className="text-sm text-muted-foreground">
                        No data for previous year
                      </div>
                    );

                  const growthPercentage =
                    ((currentYearTotal - lastYearTotal) / lastYearTotal) * 100;

                  return (
                    <div>
                      <div className="mt-1 text-lg font-bold">
                        {growthPercentage > 0 ? '+' : ''}
                        {growthPercentage.toFixed(1)}%
                      </div>
                      <div className="text-sm text-green-600">
                        Compared to {lastYear}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Average monthly revenue */}
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                <div className="text-sm font-medium text-purple-700">
                  Average Monthly Revenue
                </div>
                {(() => {
                  const currentYear = new Date().getFullYear();

                  if (!yearlyData[currentYear]) {
                    return (
                      <div className="text-sm text-muted-foreground">
                        No data for current year
                      </div>
                    );
                  }

                  const monthsWithRevenue = yearlyData[currentYear].filter(
                    (amount) => amount > 0
                  ).length;
                  const totalRevenue = yearlyData[currentYear].reduce(
                    (sum, val) => sum + val,
                    0
                  );

                  const average =
                    monthsWithRevenue > 0
                      ? totalRevenue / monthsWithRevenue
                      : 0;

                  return (
                    <div>
                      <div className="mt-1 text-lg font-bold">
                        $
                        {average.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                      <div className="text-sm text-purple-600">
                        For {currentYear}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RevenuesPage;
