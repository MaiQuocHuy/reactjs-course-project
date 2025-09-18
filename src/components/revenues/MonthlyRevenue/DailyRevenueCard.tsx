import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Skeleton } from '../../ui/skeleton';

interface DailyRevenueCardProps {
  drillDownData: {
    period: string;
    type: string;
    data: Array<{
      date: string;
      revenue: number;
    }>;
  };
  isLoading: boolean;
  error: any;
  onClose: () => void;
  formatValue: (value: number) => string;
}

const DailyRevenueCard: React.FC<DailyRevenueCardProps> = ({
  drillDownData,
  isLoading,
  error,
  onClose,
  formatValue,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Daily Data for {drillDownData.period}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            Close
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-500 font-medium">
                Failed to load daily data
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Please try selecting the month again
              </p>
            </div>
          </div>
        ) : isLoading ? (
          <div className="h-64">
            <Skeleton className="w-full h-full" />
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={drillDownData.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) =>
                    new Date(value).getDate().toString()
                  }
                />
                <YAxis tickFormatter={formatValue} />
                <Tooltip
                  formatter={(value: number) => [
                    `$${(value / 1000).toFixed(1)}k`,
                    'Revenue',
                  ]}
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString()
                  }
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyRevenueCard;