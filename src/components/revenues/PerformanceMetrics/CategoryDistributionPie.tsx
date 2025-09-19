import React, { useState, useMemo, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useGetPerformanceMetricsQuery } from '../../../services/revenuesApi';

const COLORS = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#f97316', // orange
  '#ec4899', // pink
  '#6b7280', // gray
  '#14b8a6', // teal
  '#a855f7', // purple
  '#f43f5e', // rose
  '#22c55e', // green
  '#3b82f6', // blue-500
  '#fb7185', // rose-400
  '#60a5fa', // blue-400
  '#34d399', // emerald-400
  '#fbbf24', // amber-400
  '#f87171', // red-400
];

interface CategoryData {
  name: string;
  value: number;
  percentage: string;
  percentageNum: number;
  isOthers?: boolean;
  otherCategories?: Array<{name: string; percentage: string}>;
}

interface CategoryDistributionPieProps {
  initialLimit?: number;
  showOthersThreshold?: number; // Minimum percentage to show as separate slice
}

const CategoryDistributionPie: React.FC<CategoryDistributionPieProps> = ({ 
  initialLimit = 6,
  showOthersThreshold = 2 
}) => {
  const [showAllLegend, setShowAllLegend] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Fetch performance metrics data using RTK Query
  const { 
    data: performanceData, 
    isLoading, 
    error 
  } = useGetPerformanceMetricsQuery();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const allData = useMemo((): CategoryData[] => {
    if (!performanceData?.categoryRevenues) return [];

    // Transform CategoryRevenue to CategoryData and calculate total
    const categoryData = performanceData.categoryRevenues.map(item => ({
      name: item.category,
      value: item.revenue,
    }));

    const total = categoryData.reduce((sum, item) => sum + item.value, 0);
    
    return categoryData
      .map(item => ({
        name: item.name,
        value: item.value,
        percentage: (item.value / total * 100).toFixed(1),
        percentageNum: item.value / total * 100,
      }))
      .sort((a, b) => b.value - a.value);
  }, [performanceData]);

  const pieData = useMemo((): CategoryData[] => {
    if (!allData.length) return [];

    // Get significant categories
    const significantData = allData.filter(
      item => item.percentageNum >= showOthersThreshold
    );
    
    // Group small categories into "Others"
    const smallCategories = allData.filter(
      item => item.percentageNum < showOthersThreshold
    );

    let processedData: CategoryData[] = significantData.slice(0, initialLimit);

    // Add "Others" category if there are remaining items
    const remainingCategories = [
      ...significantData.slice(initialLimit),
      ...smallCategories
    ];

    if (remainingCategories.length > 0) {
      const othersValue = remainingCategories.reduce((sum, item) => sum + item.value, 0);
      const total = allData.reduce((sum, item) => sum + item.value, 0);
      
      processedData.push({
        name: `Others (${remainingCategories.length})`,
        value: othersValue,
        percentage: (othersValue / total * 100).toFixed(1),
        percentageNum: othersValue / total * 100,
        isOthers: true,
        otherCategories: remainingCategories.map(item => ({
          name: item.name,
          percentage: item.percentage
        }))
      });
    }

    return processedData;
  }, [allData, initialLimit, showOthersThreshold]);

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    if (percent < 0.05) return null; // Don't show labels for slices smaller than 5%

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const legendData: CategoryData[] = showAllLegend ? allData : pieData;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Revenue Distribution
          </CardTitle>
          {allData.length > initialLimit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllLegend(!showAllLegend)}
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              {showAllLegend ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Show All ({allData.length})
                </>
              )}
            </Button>
          )}
        </div>
        <p className="text-sm text-gray-600">
          {isLoading
            ? "Loading revenue distribution..."
            : showAllLegend 
              ? `Showing all ${allData.length} categories in legend` 
              : `Pie shows top ${Math.min(initialLimit, allData.length)} categories`
          }
        </p>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="text-red-500 text-sm mb-4 p-3 bg-red-50 rounded-lg">
            Failed to load revenue distribution data
          </div>
        )}
        
        {isLoading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading chart data...
            </div>
          </div>
        ) : (
          <>
            <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={isMobile ? 110 : 140}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [
                  `$${(value / 1000).toFixed(0)}k`,
                  'Revenue',
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className={`mt-4 grid gap-2 ${legendData.length <= 6 ? 'grid-cols-2' : 'grid-cols-1'} ${legendData.length > 10 ? 'max-h-48 overflow-y-auto' : ''}`}>
          {legendData.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ 
                  backgroundColor: entry.isOthers 
                    ? COLORS[pieData.findIndex(item => item.isOthers) % COLORS.length]
                    : COLORS[index % COLORS.length] 
                }}
              />
              <span className="truncate">{entry.name}</span>
              <span className="text-gray-500 flex-shrink-0">({entry.percentage}%)</span>
            </div>
          ))}
        </div>

        {/* Show details for "Others" category when expanded */}
        {showAllLegend && pieData.some(item => item.isOthers) && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Categories in "Others":
            </p>
            <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
              {pieData
                .find(item => item.isOthers)
                ?.otherCategories?.map((cat) => (
                  <div key={cat.name} className="flex justify-between">
                    <span className="truncate">{cat.name}</span>
                    <span>({cat.percentage}%)</span>
                  </div>
                ))}
            </div>
          </div>
        )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryDistributionPie;