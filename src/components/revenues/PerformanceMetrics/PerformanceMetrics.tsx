import React from 'react';
import CategoryRevenueChart from './CategoryRevenueChart';
import CategoryDistributionPie from './CategoryDistributionPie';

interface PerformanceMetricsProps {
  /** Number of categories to show per page in bar chart */
  barChartLimit?: number;
  /** Initial number of categories to show in pie chart */
  pieChartLimit?: number;
  /** Minimum percentage threshold for separate pie slice (smaller ones go to "Others") */
  pieOthersThreshold?: number;
  /** Custom grid layout classes */
  gridClassName?: string;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  barChartLimit = 8, // Items per page for bar chart
  pieChartLimit = 8, // Increased from 6 to show more categories by default
  pieOthersThreshold = 1.5, // Lowered from 2 to include more categories in separate slices
  gridClassName = 'grid grid-cols-1 gap-6',
}) => {
  return (
    <div className={gridClassName}>
      <CategoryRevenueChart itemsPerPage={barChartLimit} />
      <CategoryDistributionPie
        initialLimit={pieChartLimit}
        showOthersThreshold={pieOthersThreshold}
      />
    </div>
  );
};

export default PerformanceMetrics;
