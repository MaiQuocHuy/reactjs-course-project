
import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {};

// Mock revenue data for demo purposes
const mockYearly: Record<number, number[]> = {
  2022: [1200, 900, 800, 1100, 1300, 1400, 1250, 1500, 1700, 1600, 1800, 2000],
  2023: [1500, 1200, 1000, 1300, 1600, 1700, 1500, 1800, 1900, 2100, 2200, 2400],
  2024: [1800, 1400, 1300, 1600, 1900, 2000, 1800, 2100, 2300, 2500, 2600, 2800],
};

const RevenuesPage: React.FC<Props> = () => {
  const [tab, setTab] = useState<"monthly" | "yearly">("monthly");
  const years = Object.keys(mockYearly).map((y) => Number(y)).sort();
  const [selectedYear, setSelectedYear] = useState<number | "all">("all");
  const [startMonth, setStartMonth] = useState<number>(1);
  const [endMonth, setEndMonth] = useState<number>(12);
  const [startYear, setStartYear] = useState<number>(years[0]);
  const [endYear, setEndYear] = useState<number>(years[years.length - 1]);

  const totalRevenue = useMemo(() => {
    let total = 0;
    Object.values(mockYearly).forEach((arr) => (total += arr.reduce((a, b) => a + b, 0)));
    return total;
  }, []);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Helper to render a column chart using Recharts
  const ColumnChart: React.FC<{ values: number[]; labels?: string[] }> = ({ values, labels }) => {
    const data = values.map((v, i) => ({ name: labels ? labels[i] : String(i + 1), value: v }));
    return (
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
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
          <h1 className="text-3xl font-bold tracking-tight">Revenue Statistics</h1>
          <p className="text-muted-foreground">Overview and detailed revenue charts</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold">Total Revenue</div>
          <div className="text-2xl font-extrabold">${totalRevenue.toLocaleString()}</div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div className="space-x-2">
              <Button variant={tab === "monthly" ? "default" : "ghost"} onClick={() => setTab("monthly")}>Monthly by Year</Button>
              <Button variant={tab === "yearly" ? "default" : "ghost"} onClick={() => setTab("yearly")}>Yearly Comparison</Button>
            </div>
            <div className="flex items-center space-x-4">
              {tab === "monthly" && (
                <>
                  <label className="text-sm">Year:</label>
                  <select
                    className="border rounded px-2 py-1"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value === "all" ? "all" : Number(e.target.value))}
                  >
                    <option value="all">All years</option>
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>

                  <label className="text-sm">Months:</label>
                  <select className="border rounded px-2 py-1" value={startMonth} onChange={(e) => setStartMonth(Number(e.target.value))}>
                    {months.map((m, i) => (
                      <option key={i} value={i + 1}>{m}</option>
                    ))}
                  </select>
                  <span>to</span>
                  <select className="border rounded px-2 py-1" value={endMonth} onChange={(e) => setEndMonth(Number(e.target.value))}>
                    {months.map((m, i) => (
                      <option key={i} value={i + 1}>{m}</option>
                    ))}
                  </select>
                </>
              )}

              {tab === "yearly" && (
                <>
                  <label className="text-sm">From</label>
                  <select className="border rounded px-2 py-1" value={startYear} onChange={(e) => setStartYear(Number(e.target.value))}>
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  <label className="text-sm">to</label>
                  <select className="border rounded px-2 py-1" value={endYear} onChange={(e) => setEndYear(Number(e.target.value))}>
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {tab === "monthly" && (
            <div>
              <div className="mb-4">
                <div className="font-medium">Monthly revenue</div>
                <div className="text-sm text-muted-foreground">Compare revenue across the 12 months of a selected year</div>
              </div>
              {/* Determine which years to show: if selectedYear is a number show that year's months, otherwise aggregate all years (sum per month) */}
              {(() => {
                if (selectedYear === "all") {
                  // aggregate per month across all years
                  const agg = new Array(12).fill(0);
                  Object.values(mockYearly).forEach((arr) => arr.forEach((v: number, i: number) => (agg[i] += v)));
                  return <ColumnChart values={agg} labels={months} />;
                } else {
                  const vals = mockYearly[Number(selectedYear)] || new Array(12).fill(0);
                  return <ColumnChart values={vals} labels={months} />;
                }
              })()}
            </div>
          )}

          {tab === "yearly" && (
            <div>
              <div className="mb-4">
                <div className="font-medium">Yearly revenue</div>
                <div className="text-sm text-muted-foreground">Compare total revenue of each year</div>
              </div>
              {(() => {
                const yearVals = years.map((y) => {
                  const arr = mockYearly[y] || [];
                  const sum = arr.reduce((a: number, b: number) => a + b, 0);
                  return sum;
                });
                return <ColumnChart values={yearVals} labels={years.map(String)} />;
              })()}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenuesPage;