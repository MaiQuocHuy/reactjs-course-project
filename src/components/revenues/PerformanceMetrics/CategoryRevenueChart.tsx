import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { BarChart3, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useGetPerformanceMetricsQuery } from '../../../services/revenuesApi';

interface CategoryRevenueChartProps {
  itemsPerPage?: number;
}

interface ChartDataItem {
  category: string;
  revenue: number;
  displayRevenue: string;
  originalCategory: string;
  studentsCount: number;
  coursesCount: number;
}

interface PaginatedData {
  data: ChartDataItem[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

const CategoryRevenueChart: React.FC<CategoryRevenueChartProps> = ({ 
  itemsPerPage = 8 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Fetch performance metrics data using RTK Query
  const { 
    data: performanceData, 
    isLoading, 
    error 
  } = useGetPerformanceMetricsQuery();

  // Transform and paginate data
  const paginatedData: PaginatedData | null = useMemo(() => {
    if (!performanceData?.categoryRevenues) return null;

    // Transform CategoryRevenue to ChartDataItem
    const chartData: ChartDataItem[] = performanceData.categoryRevenues.map((item) => {
      return {
        category: item.category.replace(' ', '\n'),
        originalCategory: item.category,
        revenue: item.revenue,
        displayRevenue: item.revenue.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        }),
        studentsCount: item.studentsCount,
        coursesCount: item.coursesCount,
      };
    }).sort((a, b) => b.revenue - a.revenue);

    // Implement client-side pagination
    const totalItems = chartData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = chartData.slice(startIndex, endIndex);

    return {
      data: paginatedItems,
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      hasNext: currentPage < totalPages,
      hasPrevious: currentPage > 1,
    };
  }, [performanceData, currentPage, itemsPerPage]);

  const handlePrevious = () => {
    if (paginatedData?.hasPrevious) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (paginatedData?.hasNext) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePageSelect = (page: number) => {
    setCurrentPage(page);
  };

  // Calculate dynamic height based on displayed data length
  const chartHeight = Math.max(320, (paginatedData?.data.length || 0) * 40);

  // Handle error display
  const errorMessage = error 
    ? 'Failed to load category revenue data' 
    : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Revenue per Course Category
          </CardTitle>
          {paginatedData && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>
                Page {paginatedData.currentPage} of {paginatedData.totalPages}
              </span>
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          {paginatedData && (
            <p className="text-sm text-gray-600">
              Showing {paginatedData.data.length} of {paginatedData.totalItems} categories
              <span className="ml-2 text-blue-600 font-medium">
                ({((paginatedData.currentPage - 1) * paginatedData.itemsPerPage + 1)}-{Math.min(paginatedData.currentPage * paginatedData.itemsPerPage, paginatedData.totalItems)})
              </span>
            </p>
          )}
          
          {/* Pagination Controls */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={isLoading || !paginatedData?.hasPrevious}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            {/* Page Numbers */}
            {paginatedData && paginatedData.totalPages > 1 && (
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, paginatedData.totalPages) }, (_, i) => {
                  let pageNum;
                  if (paginatedData.totalPages <= 5) {
                    pageNum = i + 1;
                  } else {
                    const current = paginatedData.currentPage;
                    if (current <= 3) {
                      pageNum = i + 1;
                    } else if (current >= paginatedData.totalPages - 2) {
                      pageNum = paginatedData.totalPages - 4 + i;
                    } else {
                      pageNum = current - 2 + i;
                    }
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === paginatedData.currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageSelect(pageNum)}
                      disabled={isLoading}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={isLoading || !paginatedData?.hasNext}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4 p-3 bg-red-50 rounded-lg">
            {errorMessage}
          </div>
        )}
        
        <div 
          style={{ height: chartHeight }}
          className="relative"
        >
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading categories...
              </div>
            </div>
          )}
          
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={paginatedData?.data || []}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="category"
                angle={-45}
                textAnchor="end"
                height={100}
                fontSize={12}
              />
              <YAxis
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value: number) => [
                  `$${(value / 1000).toFixed(0)}k`,
                  'Revenue',
                ]}
                labelFormatter={(label, payload) => {
                  const item = payload?.[0]?.payload as ChartDataItem;
                  return item ? item.originalCategory : label;
                }}
              />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Quick navigation info */}
        {paginatedData && (
          <div className="mt-4 flex flex-wrap gap-2 justify-center text-xs text-gray-500">
            <span>Total Revenue: ${(paginatedData.data.reduce((sum: number, item: ChartDataItem) => sum + item.revenue, 0) / 1000).toFixed(0)}k</span>
            <span>•</span>
            <span>Categories on this page: {paginatedData.data.length}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryRevenueChart;