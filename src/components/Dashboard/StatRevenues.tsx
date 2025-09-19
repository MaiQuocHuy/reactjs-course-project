import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../ui/card';
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

interface Payment {
  id: string;
  amount: number;
  createdAt: string | Date;
  user: {
    name: string;
  };
  course: {
    title: string;
  };
  paymentMethod: string;
  status: string;
}

interface PaymentData {
  data: {
    content: Payment[];
  };
}

interface StatRevenuesProps {
  payments?: PaymentData;
}

const StatRevenues: React.FC<StatRevenuesProps> = ({ payments }) => {
  const calculateMonthlyRevenue = (payments: Payment[], monthIndex: number, year: number) => {
    return payments
      .filter((payment) => {
        const paymentDate = payment.createdAt
          ? new Date(String(payment.createdAt))
          : null;
        return (
          paymentDate &&
          paymentDate.getMonth() === monthIndex &&
          paymentDate.getFullYear() === year
        );
      })
      .reduce((acc, payment) => acc + payment.amount, 0);
  };

  const calculatePercentageChange = () => {
    if (!payments || payments.data.content.length === 0) return '0%';

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;

    // Get current month revenue
    const currentMonthRevenue = calculateMonthlyRevenue(
      payments.data.content,
      currentMonth,
      currentDate.getFullYear()
    );

    // Get last month revenue
    const lastMonthRevenue = calculateMonthlyRevenue(
      payments.data.content,
      lastMonth,
      lastMonth === 11 ? currentDate.getFullYear() - 1 : currentDate.getFullYear()
    );

    // Calculate percentage change
    const percentageChange =
      lastMonthRevenue === 0
        ? '100%'
        : `${(
            ((currentMonthRevenue - lastMonthRevenue) /
              lastMonthRevenue) *
            100
          ).toFixed(0)}%`;

    const prefix = currentMonthRevenue >= lastMonthRevenue ? '+' : '';
    return `${prefix}${percentageChange} from last month`;
  };

  const getChartData = () => {
    if (!payments || payments.data.content.length === 0) {
      return [{ name: 'No Data', value: 0 }];
    }

    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
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
      const monthlyRevenue = calculateMonthlyRevenue(
        payments.data.content,
        month.index,
        month.year
      );

      return {
        name: month.name,
        value: Math.round(monthlyRevenue * 0.3 * 100) / 100, // Platform gets 30% of payment
      };
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Overview of recent revenues</CardTitle>
          </div>
          {payments && payments.data.content.length > 0 && (
            <div className="text-right">
              <div className="text-lg font-bold">
                {calculatePercentageChange()}
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
                data={getChartData()}
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