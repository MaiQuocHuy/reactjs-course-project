import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { Badge } from "../../../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import {
  ArrowLeft,
  Edit,
  Shield,
  UserMinus,
  UserPlus,
  Loader2,
  Mail,
  Activity,
  CreditCard,
  BookOpen,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
} from "lucide-react";
import {
  useGetUserByIdQuery,
  useUpdateUserStatusMutation,
} from "../../../services/usersApi";

export const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch user data using RTK Query
  const {
    data: userResponse,
    isLoading,
    isError,
    error,
  } = useGetUserByIdQuery(id!, {
    skip: !id,
  });

  // Mutations for user actions
  const [updateUserStatus] = useUpdateUserStatusMutation();

  // Extract user data from API response
  const user = userResponse?.data;

  // Debug logging
  console.log("UserDetailPage Debug:", {
    id,
    isLoading,
    isError,
    error,
    userResponse,
    user,
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <h2 className="text-xl font-semibold">Loading user details...</h2>
        <p className="text-muted-foreground">
          Please wait while we fetch the information
        </p>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Error Loading User</h2>
          <p className="text-muted-foreground mt-2">
            Failed to load user details:{" "}
            {error ? JSON.stringify(error) : "Unknown error"}
          </p>
          <p className="text-sm text-muted-foreground mt-2">User ID: {id}</p>
        </div>
        <Button onClick={() => navigate("/admin/users")} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>
      </div>
    );
  }

  // Check if user data is not available
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">User Not Found</h2>
          <p className="text-muted-foreground mt-2">
            The user you're looking for doesn't exist or the data structure is
            unexpected.
          </p>
          <p className="text-sm text-muted-foreground mt-2">User ID: {id}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Debug: userResponse ={" "}
            {userResponse ? JSON.stringify(userResponse) : "undefined"}
          </p>
        </div>
        <Button onClick={() => navigate("/admin/users")} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>
      </div>
    );
  }

  const handleEdit = () => {
    console.log("Edit user:", user.id);
    // TODO: Navigate to edit page or open edit modal
  };

  const handleAssignRole = async () => {
    try {
      console.log("Assign role to user:", user.id);
      // TODO: Open role assignment modal
    } catch (error) {
      console.error("Failed to update user role:", error);
    }
  };

  const handleBanUnban = async () => {
    try {
      const newStatus = !user.isActive;
      await updateUserStatus({
        id: user.id,
        data: { isActive: newStatus },
      }).unwrap();
      console.log(
        newStatus ? "User unbanned successfully" : "User banned successfully"
      );
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "destructive" as const;
      case "INSTRUCTOR":
        return "default" as const;
      case "STUDENT":
        return "secondary" as const;
      default:
        return "outline" as const;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      console.error("Error parsing date:", dateString, error);
      return dateString;
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds === 0) return "0 minutes";
    const hours = Math.floor(seconds / 3600); // 3600 seconds = 1 hour
    const minutes = Math.floor((seconds % 3600) / 60); // remaining seconds to minutes

    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return minutes > 0 ? `${minutes}m` : "< 1m";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin/users")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
            <p className="text-muted-foreground">
              Comprehensive view of user information and activities
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" onClick={handleAssignRole}>
            <Shield className="mr-2 h-4 w-4" />
            Assign Role
          </Button>
          {user.isActive ? (
            <Button variant="destructive" onClick={handleBanUnban}>
              <UserMinus className="mr-2 h-4 w-4" />
              Ban User
            </Button>
          ) : (
            <Button variant="default" onClick={handleBanUnban}>
              <UserPlus className="mr-2 h-4 w-4" />
              Unban User
            </Button>
          )}
        </div>
      </div>

      {/* User Profile Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={user.thumbnailUrl || user.avatar}
                alt={user.name}
              />
              <AvatarFallback className="text-xl">
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-muted-foreground">ID: {user.id}</p>
                {user.bio && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {user.bio}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant={getRoleBadgeVariant(user.role)}>
                  {user.role}
                </Badge>
                <Badge variant={user.isActive ? "default" : "destructive"}>
                  {user.isActive ? "Active" : "Banned"}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {user.enrolledCourses?.length || 0} courses enrolled
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Enrolled Courses
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {user.enrolledCourses?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total courses enrolled
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Payments
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${user.totalPayments?.toFixed(2) || "0.00"}
                </div>
                <p className="text-xs text-muted-foreground">Lifetime value</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Study Time
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {user.totalStudyTimeSeconds
                    ? formatTime(user.totalStudyTimeSeconds)
                    : "0m"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total learning time
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completion Rate
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {user.enrolledCourses && user.enrolledCourses.length > 0
                    ? Math.round(
                        (user.enrolledCourses.filter(
                          (c) => c.completionStatus === "COMPLETED"
                        ).length /
                          user.enrolledCourses.length) *
                          100
                      )
                    : 0}
                  %
                </div>
                <p className="text-xs text-muted-foreground">
                  Courses completed
                </p>
              </CardContent>
            </Card>
          </div>

          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Full Name
                  </label>
                  <p className="font-medium">{user.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Email
                  </label>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Role
                  </label>
                  <p className="font-medium">
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role}
                    </Badge>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Account Status
                  </label>
                  <p className="font-medium">
                    <Badge variant={user.isActive ? "default" : "destructive"}>
                      {user.isActive ? "Active" : "Banned"}
                    </Badge>
                  </p>
                </div>
                {user.bio && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Bio
                    </label>
                    <p className="font-medium">{user.bio}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>
                Enrolled Courses ({user.enrolledCourses?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.enrolledCourses && user.enrolledCourses.length > 0 ? (
                <div className="space-y-4">
                  {user.enrolledCourses.map((course) => (
                    <div
                      key={course.courseId}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {course.courseTitle}
                          </h3>
                          <p className="text-muted-foreground">
                            Instructor: {course.instructorName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Course ID: {course.courseId}
                          </p>
                        </div>
                        <Badge
                          variant={
                            course.completionStatus === "COMPLETED"
                              ? "default"
                              : "secondary"
                          }
                          className="ml-4"
                        >
                          {course.completionStatus === "COMPLETED" ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 mr-1" />
                              In Progress
                            </>
                          )}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Enrolled:
                          </span>
                          <p className="font-medium">
                            {formatDate(course.enrolledAt)}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Paid Amount:
                          </span>
                          <p className="font-medium">
                            ${course.paidAmount.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Study Time:
                          </span>
                          <p className="font-medium">
                            {formatTime(course.totalTimeStudying)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No courses found
                  </h3>
                  <p className="text-muted-foreground">
                    This user hasn't enrolled in any courses yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <p className="text-sm text-muted-foreground">
                Total Lifetime Value: $
                {user.totalPayments?.toFixed(2) || "0.00"}
              </p>
            </CardHeader>
            <CardContent>
              {user.enrolledCourses && user.enrolledCourses.length > 0 ? (
                <div className="space-y-4">
                  {user.enrolledCourses
                    .filter((course) => course.paidAmount > 0)
                    .map((course) => (
                      <div
                        key={course.courseId}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold">
                              {course.courseTitle}
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              Instructor: {course.instructorName}
                            </p>
                            <p className="text-muted-foreground text-sm">
                              Course ID: {course.courseId}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">
                              ${course.paidAmount.toFixed(2)}
                            </p>
                            <Badge variant="default" className="text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Paid
                            </Badge>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">
                              Payment Date: {formatDate(course.enrolledAt)}
                            </span>
                            <span className="text-muted-foreground">
                              Status:
                              <span className="text-green-600 font-medium ml-1">
                                Completed
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                  {user.enrolledCourses.filter(
                    (course) => course.paidAmount > 0
                  ).length === 0 && (
                    <div className="text-center py-8">
                      <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        No payments found
                      </h3>
                      <p className="text-muted-foreground">
                        This user hasn't made any payments yet.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No payments found
                  </h3>
                  <p className="text-muted-foreground">
                    This user hasn't made any payments yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <p className="text-sm text-muted-foreground">
                Recent learning activities and course enrollments
              </p>
            </CardHeader>
            <CardContent>
              {user.enrolledCourses && user.enrolledCourses.length > 0 ? (
                <div className="space-y-4">
                  {[...user.enrolledCourses]
                    .sort(
                      (a, b) =>
                        new Date(b.enrolledAt).getTime() -
                        new Date(a.enrolledAt).getTime()
                    )
                    .map((course) => (
                      <div
                        key={course.courseId}
                        className="flex items-start space-x-4 p-4 border rounded-lg"
                      >
                        <div className="flex-shrink-0">
                          {course.completionStatus === "COMPLETED" ? (
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                          ) : (
                            <BookOpen className="h-5 w-5 text-blue-600 mt-0.5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">
                                {course.completionStatus === "COMPLETED"
                                  ? "Completed course"
                                  : "Enrolled in course"}
                                : {course.courseTitle}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Instructor: {course.instructorName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Paid: ${course.paidAmount.toFixed(2)}
                              </p>
                              {course.totalTimeStudying > 0 && (
                                <p className="text-sm text-muted-foreground">
                                  Study time:{" "}
                                  {formatTime(course.totalTimeStudying)}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">
                                {formatDate(course.enrolledAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No activity found
                  </h3>
                  <p className="text-muted-foreground">
                    No recent activity to display.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
