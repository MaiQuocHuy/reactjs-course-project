import React from 'react';
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
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  BookOpen,
  Eye,
} from 'lucide-react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import PendingCourses from '@/components/courses/PendingCourses';

export const DashboardPage: React.FC = () => {
  // Mock data for dashboard
  const stats = [
    {
      title: 'Total Users',
      value: '2,543',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
    },
    {
      title: 'Total Revenue',
      value: '$45,231',
      change: '+8%',
      changeType: 'positive' as const,
      icon: DollarSign,
    },
    {
      title: 'Active Courses',
      value: '128',
      change: '+4%',
      changeType: 'positive' as const,
      icon: BookOpen,
    },
    {
      title: 'Pending Refunds',
      value: '23',
      change: '-2%',
      changeType: 'negative' as const,
      icon: RefreshCw,
    },
  ];

  const recentUsers = [
    {
      id: 'user-001',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'STUDENT',
      status: 'ACTIVE',
      joinedAt: '2024-03-15',
      avatar: '/api/placeholder/32/32',
    },
    {
      id: 'user-002',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'INSTRUCTOR',
      status: 'ACTIVE',
      joinedAt: '2024-03-14',
      avatar: '/api/placeholder/32/32',
    },
    {
      id: 'user-003',
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      role: 'STUDENT',
      status: 'BANNED',
      joinedAt: '2024-03-13',
      avatar: '/api/placeholder/32/32',
    },
  ];

  const recentPayments = [
    {
      id: 'pay-001',
      user: 'Alice Brown',
      course: 'React Masterclass',
      amount: '$99.99',
      status: 'COMPLETED',
      date: '2024-03-15',
    },
    {
      id: 'pay-002',
      user: 'Charlie Wilson',
      course: 'Vue.js Fundamentals',
      amount: '$79.99',
      status: 'PENDING',
      date: '2024-03-15',
    },
    {
      id: 'pay-003',
      user: 'Diana Miller',
      course: 'Angular Advanced',
      amount: '$129.99',
      status: 'FAILED',
      date: '2024-03-14',
    },
  ];

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
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground flex items-center">
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
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pending courses */}
      <PendingCourses/>

      {/* Revenue statistics */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Overview of recent revenue</CardTitle>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">+8% from last month</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            {/* 3-month column chart (recharts) */}
            <div className="w-full h-36">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Jul', value: 700 },
                    { name: 'Aug', value: 500 },
                    { name: 'Sep', value: 900 },
                  ]}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-end">
              <Link to="/admin/revenues">
                <Button size="sm">View more</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>
                  Latest user registrations on your platform
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
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
                          .map((n) => n[0])
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
                      variant={getStatusBadgeVariant(user.status)}
                      className="text-xs"
                    >
                      {user.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Payments</CardTitle>
                <CardDescription>Latest payment transactions</CardDescription>
              </div>
              <Button variant="outline" size="sm">
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
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{payment.user}</p>
                        <p className="text-sm text-muted-foreground">
                          {payment.course}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {payment.amount}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(payment.status)}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
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
      </Card>

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
