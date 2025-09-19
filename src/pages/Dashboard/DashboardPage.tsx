import React, { useEffect, useState } from 'react';
import { Users, RefreshCw, DollarSign, BookOpen } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import PendingCourses from '@/components/courses/pending-courses/PendingCourses';
import StatRevenues from '@/components/Dashboard/StatRevenues';
import StatStudents from '@/components/Dashboard/StatStudents';
import StatPayments from '@/components/Dashboard/StatPayments';
import { useGetUsersQuery } from '@/services/usersApi';
import { useGetAllCoursesQuery } from '@/services/coursesApi';
import { useGetPaymentsQuery } from '@/services/paymentsApi';
import { useGetRefundsQuery } from '@/services/refundsApi';
import SystemStatus from '@/components/Dashboard/SystemStatus';
import { DashboardSkeleton } from '@/components/Dashboard/DashboardSkeleton';

interface Stats {
  title: string;
  value: string;
  icon: React.ElementType;
}

export const DashboardPage: React.FC = () => {
  // Initialize stats with default structure to avoid array index issues
  const [stats, setStats] = useState<Stats[]>([
    { title: 'Total Users', value: '0', icon: Users },
    { title: 'Total Revenue', value: '$0', icon: DollarSign },
    { title: 'Total Courses', value: '0', icon: BookOpen },
    { title: 'Pending Refunds', value: '0', icon: RefreshCw },
  ]);

  const { data: users, isLoading: isLoadingUsers } = useGetUsersQuery({});
  const { data: courses, isLoading: isLoadingCourses } = useGetAllCoursesQuery(
    {}
  );
  const { data: payments, isLoading: isLoadingPayments } = useGetPaymentsQuery(
    {}
  );
  const { data: refunds, isLoading: isLoadingRefunds } = useGetRefundsQuery({});

  useEffect(() => {
    const newStats = [...stats];

    if (users && users.data.users.length > 0) {
      newStats[0] = {
        title: 'Total Users',
        value: users.data.users.length.toString(),
        icon: Users,
      };
    }

    if (payments && payments.data.content.length > 0) {
      const totalRevenue = payments.data.content.reduce(
        (acc, payment) => acc + payment.amount,
        0
      );
      newStats[1] = {
        title: 'Total Revenue',
        value: `$${Math.round(totalRevenue * 0.3 * 100) / 100}`,
        icon: DollarSign,
      };
    }

    if (courses && courses.content.length > 0) {
      newStats[2] = {
        title: 'Total Courses',
        value: courses.content.length.toString(),
        icon: BookOpen,
      };
    }

    if (refunds && refunds.data.content.length > 0) {
      newStats[3] = {
        title: 'Pending Refunds',
        value: refunds.data.content.length.toString(),
        icon: RefreshCw,
      };
    }

    // Set the entire new array at once to ensure React detects the change
    setStats(newStats);
  }, [users, refunds, payments, courses]);

  if (
    isLoadingUsers ||
    isLoadingCourses ||
    isLoadingPayments ||
    isLoadingRefunds
  ) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your platform.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="gap-3">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pending courses */}
      <PendingCourses />

      {/* Revenue statistics */}
      <StatRevenues />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Students */}
        <StatStudents users={users} />

        {/* Recent Payments */}
        <StatPayments payments={payments} />
      </div>

      {/* System Status */}
      <SystemStatus />
    </div>
  );
};
