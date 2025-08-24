import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../components/ui/avatar';
import {
  Users,
  CreditCard,
  RefreshCw,
  Activity,
  Eye,
  DollarSign,
  BookOpen,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import PendingCourses from '@/components/courses/PendingCourses';
import { useGetUsersQuery } from '@/services/usersApi';
import { useAppSelector } from '@/hooks/redux';
import { useGetAllCoursesQuery } from '@/services/courses-api';

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
  const { payments, loading: isLoadingPayments } = useAppSelector(
    (state) => state.payments
  );
  const { refunds, loading: isLoadingRefunds } = useAppSelector(
    (state) => state.refunds
  );

  const navigate = useNavigate();

  useEffect(() => {
    const newStats = [...stats];

    if (users && users.data.users.length > 0) {
      newStats[0] = {
        title: 'Total Users',
        value: users.data.users.length.toString(),
        icon: Users,
      };
    }

    if (payments && payments.length > 0) {
      const totalRevenue = payments.reduce(
        (acc, payment) => acc + payment.amount,
        0
      );
      newStats[1] = {
        title: 'Total Revenue',
        value: `$${Math.round(totalRevenue * 0.3 * 100) / 100}`,
        icon: DollarSign,
      };
    }

    if (courses && courses.data.content.length > 0) {
      newStats[2] = {
        title: 'Total Courses',
        value: courses.data.content.length.toString(),
        icon: BookOpen,
      };
    }

    if (refunds && refunds.length > 0) {
      newStats[3] = {
        title: 'Pending Refunds',
        value: refunds.length.toString(),
        icon: RefreshCw,
      };
    }

    // Set the entire new array at once to ensure React detects the change
    setStats(newStats);
  }, [users, refunds, payments, courses]);

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'destructive';
      case 'INSTRUCTOR':
        return 'default';
      case 'STUDENT':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE':
      case 'COMPLETED':
        return 'default';
      case 'BANNED':
      case 'FAILED':
        return 'destructive';
      case 'PENDING':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (
    isLoadingUsers ||
    isLoadingCourses ||
    isLoadingPayments ||
    isLoadingRefunds
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-t-primary border-r-transparent border-b-primary border-l-transparent animate-spin"></div>
          <p className="text-lg font-medium text-muted-foreground">
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
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
                {/* <p className="text-xs text-muted-foreground flex items-center">
                  {stat.changeType === 'positive' ? (
                    <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                  )}
                  <span
                    className={
                      stat.changeType === 'positive'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    {stat.change}
                  </span>
                  <span className="ml-1">from last month</span>
                </p> */}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pending courses */}
      <PendingCourses />

      {/* Revenue statistics */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Overview of recent revenue</CardTitle>
            </div>
            {payments && payments.length > 0 && (
              <div className="text-right">
                <div className="text-lg font-bold">
                  {(() => {
                    const currentDate = new Date();
                    const currentMonth = currentDate.getMonth();
                    const lastMonth =
                      currentMonth === 0 ? 11 : currentMonth - 1;

                    // Get current month revenue
                    const currentMonthRevenue = payments
                      .filter((payment) => {
                        if (!payment.createdAt) return false;
                        const paymentDate = payment.createdAt
                          ? new Date(String(payment.createdAt))
                          : null;
                        return (
                          paymentDate &&
                          paymentDate.getMonth() === currentMonth &&
                          paymentDate.getFullYear() ===
                            currentDate.getFullYear()
                        );
                      })
                      .reduce((acc, payment) => acc + payment.amount, 0);

                    // Get last month revenue
                    const lastMonthRevenue = payments
                      .filter((payment) => {
                        const paymentDate = payment.createdAt
                          ? new Date(String(payment.createdAt))
                          : null;
                        return (
                          paymentDate &&
                          paymentDate.getMonth() === lastMonth &&
                          (lastMonth === 11
                            ? paymentDate.getFullYear() ===
                              currentDate.getFullYear() - 1
                            : paymentDate.getFullYear() ===
                              currentDate.getFullYear())
                        );
                      })
                      .reduce((acc, payment) => acc + payment.amount, 0);

                    // Calculate percentage change
                    const percentageChange =
                      lastMonthRevenue === 0
                        ? '100%'
                        : `${(
                            ((currentMonthRevenue - lastMonthRevenue) /
                              lastMonthRevenue) *
                            100
                          ).toFixed(0)}%`;

                    const prefix =
                      currentMonthRevenue >= lastMonthRevenue ? '+' : '';
                    return `${prefix}${percentageChange} from last month`;
                  })()}
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            {/* Monthly revenue chart (recharts) */}
            <div className="w-full h-36">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={(() => {
                    if (!payments || payments.length === 0) {
                      return [{ name: 'No Data', value: 0 }];
                    }

                    const monthNames = [
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

                    // Get the current date to determine the last 3 months
                    const currentDate = new Date();
                    const currentMonth = currentDate.getMonth();

                    // Calculate the last 3 months (including current)
                    const last3Months = [];
                    for (let i = 2; i >= 0; i--) {
                      const monthIndex = (currentMonth - i + 12) % 12;
                      last3Months.push({
                        index: monthIndex,
                        name: monthNames[monthIndex],
                        year:
                          currentMonth - i < 0
                            ? currentDate.getFullYear() - 1
                            : currentDate.getFullYear(),
                      });
                    }

                    // Calculate revenue for each month
                    return last3Months.map((month) => {
                      const monthlyRevenue = payments
                        .filter((payment) => {
                          const paymentDate = payment.createdAt
                            ? new Date(String(payment.createdAt))
                            : null;
                          return (
                            paymentDate &&
                            paymentDate.getMonth() === month.index &&
                            paymentDate.getFullYear() === month.year
                          );
                        })
                        .reduce((acc, payment) => acc + payment.amount, 0);

                      return {
                        name: month.name,
                        value: Math.round(monthlyRevenue * 0.3 * 100) / 100, // Platform gets 30% of payment
                      };
                    });
                  })()}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Students */}
        {users && users?.data?.users?.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>
                    Latest user registrations on your platform
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => navigate('/admin/users')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.data.users
                  .slice(
                    0,
                    users.data.users.length > 5 ? 5 : users.data.users.length
                  )
                  .map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>
                            {user.name
                              .split(' ')
                              .map((n: string) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={getRoleBadgeVariant(user.role)}
                          className="text-xs"
                        >
                          {user.role}
                        </Badge>
                        <Badge
                          variant={getStatusBadgeVariant(
                            user.isActive ? 'ACTIVE' : 'INACTIVE'
                          )}
                          className="text-xs"
                        >
                          {user.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
        {/* Recent Payments */}
        {payments && payments.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Payments</CardTitle>
                  <CardDescription>Latest payment transactions</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => navigate('/admin/payments')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments
                    .slice(0, payments.length > 5 ? 5 : payments.length)
                    .map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{payment.user.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {payment.course.title}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {payment.amount}
                        </TableCell>
                        <TableCell className="font-medium">
                          {payment.paymentMethod}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getStatusBadgeVariant(payment.status)}
                          >
                            {payment.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Users className="h-5 w-5 mb-2" />
              <span className="text-sm">Manage Users</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <CreditCard className="h-5 w-5 mb-2" />
              <span className="text-sm">View Payments</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <RefreshCw className="h-5 w-5 mb-2" />
              <span className="text-sm">Process Refunds</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Activity className="h-5 w-5 mb-2" />
              <span className="text-sm">View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card> */}

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-center">
                <div className="h-2 w-2 bg-green-600 rounded-full mr-3"></div>
                <span className="font-medium">Database</span>
              </div>
              <Badge variant="default" className="bg-green-600">
                Operational
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-center">
                <div className="h-2 w-2 bg-green-600 rounded-full mr-3"></div>
                <span className="font-medium">API Services</span>
              </div>
              <Badge variant="default" className="bg-green-600">
                Operational
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 border border-yellow-200">
              <div className="flex items-center">
                <div className="h-2 w-2 bg-yellow-600 rounded-full mr-3"></div>
                <span className="font-medium">Payment Gateway</span>
              </div>
              <Badge variant="secondary" className="bg-yellow-600 text-white">
                Maintenance
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
