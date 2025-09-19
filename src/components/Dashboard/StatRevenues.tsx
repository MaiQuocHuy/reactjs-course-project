import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useGetRecentRevenueQuery } from '@/services/revenuesApi';
import NoCourseFound from '../courses/NoCourseFound';

const StatRevenues: React.FC = () => {
  const {
    data: recentRevenuesData,
    isLoading,
    error,
    refetch,
  } = useGetRecentRevenueQuery();

  const recentRevenues =
    recentRevenuesData?.recentRevenues?.map((item) => ({
      name: item.month,
      value: item.revenue,
    })) || [];

  const calculatePercentageChange = () => {
    const growth = recentRevenuesData?.growth;
    if (!growth) return '0%';

    const prefix = growth > 0 ? '+' : '';
    return `${prefix}${growth}% from last month`;
  };

  if (isLoading) {
    return <div>Loading Data...</div>;
  }

  if (error) {
    return (
      <NoCourseFound
        title="Failed to load recent revenues"
        description={String((error as any).error ?? 'Unknown error')}
        actionLabel="Try again"
        onAction={refetch}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Overview of recent revenues</CardTitle>
          </div>
          <div className="text-right">
            <div className="font-bold">{calculatePercentageChange()}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          {/* Monthly revenue chart (recharts) */}
          <div className="w-full h-36">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={recentRevenues}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-end">
            <Link to="/admin/revenues">
              <Button size="sm" className="cursor-pointer">
                View more
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatRevenues;
