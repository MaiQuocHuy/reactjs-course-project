import {
  BarChart3,
  CalendarDays,
  Calendar,
  BarChart2,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import type { StatCard } from '@/types/revenues';
import { useGetStatisticsQuery } from '@/services/revenuesApi';

interface StatisticsProps {
  stats?: StatCard[];
}

// Helper function to determine if value indicates increase or decrease
const isIncreasing = (value: string): boolean => {
  return value.includes('+') || (value.includes('%') && !value.includes('-'));
};

// Helper function to get dynamic styling based on value and metric type
const getDynamicStyling = (title: string, value: string) => {
  const increasing = isIncreasing(value);

  // Base colors for different metrics - easily extensible for new metrics
  const colorSchemes = {
    'Total Revenue': 'blue',
    'Monthly Growth': increasing ? 'green' : 'red',
    'Yearly Growth': increasing ? 'purple' : 'red',
    'Avg Revenue Per User': 'orange',
    // Add new metrics here:
    // 'Daily Active Users': 'teal',
    // 'Conversion Rate': increasing ? 'green' : 'red',
    // 'Customer Lifetime Value': 'indigo'
  };

  const colorScheme =
    colorSchemes[title as keyof typeof colorSchemes] || 'gray';

  // Define color palettes - add new palettes for new metrics
  const colorPalettes = {
    blue: {
      bgGradient: 'bg-gradient-to-r from-blue-50 to-blue-100',
      textColor: 'text-blue-600',
      valueColor: 'text-blue-900',
      iconColor: 'text-blue-500',
      icon: <BarChart3 className="h-8 w-8 text-blue-500" />,
    },
    green: {
      bgGradient: 'bg-gradient-to-r from-green-50 to-green-100',
      textColor: 'text-green-600',
      valueColor: 'text-green-900',
      iconColor: 'text-green-500',
      icon:
        title === 'Monthly Growth' ? (
          <TrendingUp className="h-8 w-8 text-green-500" />
        ) : (
          <CalendarDays className="h-8 w-8 text-green-500" />
        ),
    },
    red: {
      bgGradient: 'bg-gradient-to-r from-red-50 to-red-100',
      textColor: 'text-red-600',
      valueColor: 'text-red-900',
      iconColor: 'text-red-500',
      icon:
        title === 'Monthly Growth' ? (
          <TrendingDown className="h-8 w-8 text-red-500" />
        ) : (
          <CalendarDays className="h-8 w-8 text-red-500" />
        ),
    },
    purple: {
      bgGradient: 'bg-gradient-to-r from-purple-50 to-purple-100',
      textColor: 'text-purple-600',
      valueColor: 'text-purple-900',
      iconColor: 'text-purple-500',
      icon: <CalendarDays className="h-8 w-8 text-purple-500" />,
    },
    orange: {
      bgGradient: 'bg-gradient-to-r from-orange-50 to-orange-100',
      textColor: 'text-orange-600',
      valueColor: 'text-orange-900',
      iconColor: 'text-orange-500',
      icon: <Calendar className="h-8 w-8 text-orange-500" />,
    },
    // Easily add new color schemes:
    // teal: {
    //   bgGradient: 'bg-gradient-to-r from-teal-50 to-teal-100',
    //   textColor: 'text-teal-600',
    //   valueColor: 'text-teal-900',
    //   iconColor: 'text-teal-500',
    //   icon: <Users className="h-8 w-8 text-teal-500" />
    // },
    // indigo: {
    //   bgGradient: 'bg-gradient-to-r from-indigo-50 to-indigo-100',
    //   textColor: 'text-indigo-600',
    //   valueColor: 'text-indigo-900',
    //   iconColor: 'text-indigo-500',
    //   icon: <DollarSign className="h-8 w-8 text-indigo-500" />
    // },
    gray: {
      bgGradient: 'bg-gradient-to-r from-gray-50 to-gray-100',
      textColor: 'text-gray-600',
      valueColor: 'text-gray-900',
      iconColor: 'text-gray-500',
      icon: <BarChart2 className="h-8 w-8 text-gray-500" />,
    },
  };

  return colorPalettes[colorScheme as keyof typeof colorPalettes];
};

const Statistics: React.FC<StatisticsProps> = () => {
  const { data: statistics, isLoading, isError } = useGetStatisticsQuery();

  if (isLoading) {
    return <div>Loading statistics...</div>;
  }
  if (isError || !statistics) {
    return <div>Error loading statistics.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statistics.stats.map((stat, index) => {
        // Get dynamic styling based on title and value
        const dynamicStyle = getDynamicStyling(stat.title, stat.value);

        return (
          <div
            key={index}
            className={`${dynamicStyle.bgGradient} p-4 rounded-lg border`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${dynamicStyle.textColor}`}>
                  {stat.title}
                </p>
                <p className={`text-2xl font-bold ${dynamicStyle.valueColor}`}>
                  {stat.value}
                </p>
              </div>
              {dynamicStyle.icon}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Statistics;
export type { StatCard, StatisticsProps };
