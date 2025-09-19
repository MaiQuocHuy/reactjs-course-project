import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

interface Payment {
  id: string;
  amount: number;
  paymentMethod: string;
  status: string;
  user: {
    name: string;
  };
  course: {
    title: string;
  };
}

interface PaymentData {
  data: {
    content: Payment[];
  };
}

interface StatPaymentsProps {
  payments?: PaymentData;
}

const StatPayments: React.FC<StatPaymentsProps> = ({ payments }) => {
  const navigate = useNavigate();

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'completed'; // Green color for active status
      case 'INACTIVE':
        return 'pending'; // Yellow color for inactive status
      case 'BANNED':
        return 'destructive'; // Red color for banned status
      case 'COMPLETED':
        return 'completed'; // Green color for completed payments
      case 'PENDING':
        return 'pending'; // Yellow color for pending payments
      case 'FAILED':
        return 'destructive'; // Red color for failed payments
      default:
        return 'outline'; // Default fallback
    }
  };

  const hasPayments = payments && payments.data.content.length > 0;
  const paymentsToShow = hasPayments 
    ? payments.data.content.slice(0, payments.data.content.length > 3 ? 3 : payments.data.content.length)
    : [];

  return (
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
        {!hasPayments ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">
                No recent payments
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Payment transactions will appear here once users make purchases
              </p>
            </div>
          </div>
        ) : (
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
              {paymentsToShow.map((payment) => (
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
                    ${payment.amount}
                  </TableCell>
                  <TableCell className="font-medium">
                    {payment.paymentMethod}
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
        )}
      </CardContent>
    </Card>
  );
};

export default StatPayments;