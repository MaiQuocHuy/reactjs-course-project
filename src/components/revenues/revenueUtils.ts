import { monthlyRevenueData, revenueByCategory, mockTopStudents, performanceMetrics } from '../../data/revenuesMockData';

// Utility functions for data export
export const exportUtils = {
  // Get all revenue data for export
  getAllRevenueData: () => {
    return monthlyRevenueData.map(item => ({
      Month: item.month,
      Year: item.year,
      Revenue: item.revenue,
      Growth: `${item.growth}%`,
      Transactions: item.transactions
    }));
  },

  // Get category revenue data for export
  getCategoryRevenueData: () => {
    return Object.entries(revenueByCategory).map(([category, revenue]) => ({
      Category: category,
      Revenue: revenue,
      'Revenue (K)': `${(revenue / 1000).toFixed(0)}k`
    }));
  },

  // Get top students data for export
  getTopStudentsData: () => {
    return mockTopStudents.map((student, index) => ({
      Rank: index + 1,
      Name: student.name,
      Email: student.email,
      'Total Spent': student.totalSpent,
      'Courses Enrolled': student.coursesEnrolled
    }));
  },

  // Get performance metrics for export
  getPerformanceMetricsData: () => {
    return [
      {
        Metric: 'Total Revenue',
        Value: `$${(performanceMetrics.totalRevenue / 1000000).toFixed(1)}M`
      },
      {
        Metric: 'Average Revenue per User',
        Value: `$${performanceMetrics.averageRevenuePerUser}`
      },
      {
        Metric: 'Monthly Growth Rate',
        Value: `${performanceMetrics.monthlyGrowthRate}%`
      },
      {
        Metric: 'Quarterly Growth Rate',
        Value: `${performanceMetrics.quarterlyGrowthRate}%`
      },
      {
        Metric: 'Yearly Growth Rate',
        Value: `${performanceMetrics.yearlyGrowthRate}%`
      },
      {
        Metric: 'Top Performing Category',
        Value: performanceMetrics.topPerformingCategory
      },
      {
        Metric: 'Worst Performing Category',
        Value: performanceMetrics.worstPerformingCategory
      },
      {
        Metric: 'Best Month',
        Value: performanceMetrics.bestMonth
      },
      {
        Metric: 'Worst Month',
        Value: performanceMetrics.worstMonth
      }
    ];
  }
};