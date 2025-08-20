import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Progress } from "../ui/progress";
import {
  CalendarDays,
  Mail,
  UserIcon,
  Clock,
  CreditCard,
  Activity,
} from "lucide-react";
import type { User, Course, Payment, ActivityLog } from "../../types/users";

interface UserDetailProps {
  user: User;
  courses: Course[];
  payments: Payment[];
  logs: ActivityLog[];
}

const formatCurrency = (amount: number, currency: string = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const UserDetail: React.FC<UserDetailProps> = ({
  user,
  courses,
  payments,
  logs,
}) => {
  return (
    <div className="space-y-6">
      {/* User Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-lg">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <UserIcon className="h-4 w-4" />
                  <span>ID: {user.id}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge
                  variant={
                    user.role === "ADMIN"
                      ? "destructive"
                      : user.role === "INSTRUCTOR"
                      ? "default"
                      : "secondary"
                  }
                >
                  {user.role}
                </Badge>
                <Badge
                  variant={
                    user.status === "ACTIVE"
                      ? "default"
                      : user.status === "BANNED"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {user.status}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Joined</p>
                <p className="text-muted-foreground">
                  {user.createdAt
                    ? formatDate(user.createdAt)
                    : "Not available"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Last Login</p>
                <p className="text-muted-foreground">
                  {user.lastLoginAt ? formatDate(user.lastLoginAt) : "Never"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Last Updated</p>
                <p className="text-muted-foreground">
                  {user.updatedAt
                    ? formatDate(user.updatedAt)
                    : "Not available"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for detailed information */}
      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">Courses ({courses.length})</TabsTrigger>
          <TabsTrigger value="payments">
            Payments ({payments.length})
          </TabsTrigger>
          <TabsTrigger value="logs">Activity Logs ({logs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Courses</CardTitle>
            </CardHeader>
            <CardContent>
              {courses.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No courses enrolled
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Enrolled Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="h-12 w-20 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium">{course.title}</p>
                              <p className="text-sm text-muted-foreground">
                                ID: {course.id}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{formatCurrency(course.price)}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Progress
                              value={course.progress}
                              className="w-[60px]"
                            />
                            <span className="text-xs text-muted-foreground">
                              {course.progress}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              course.status === "COMPLETED"
                                ? "default"
                                : course.status === "ENROLLED"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {course.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(course.enrolledAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No payment records
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {payment.transactionId}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              ID: {payment.id}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{payment.courseTitle}</TableCell>
                        <TableCell>
                          {formatCurrency(payment.amount, payment.currency)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <CreditCard className="h-4 w-4" />
                            <span>{payment.paymentMethod}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              payment.status === "COMPLETED"
                                ? "default"
                                : payment.status === "PENDING"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {payment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(payment.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Logs</CardTitle>
            </CardHeader>
            <CardContent>
              {logs.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No activity logs
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <Badge variant="outline">{log.action}</Badge>
                        </TableCell>
                        <TableCell>{log.description}</TableCell>
                        <TableCell>
                          <code className="text-sm">
                            {log.ipAddress || "N/A"}
                          </code>
                        </TableCell>
                        <TableCell>{formatDate(log.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
