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
  Calendar,
  Activity,
  CreditCard,
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
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
  } = useGetUserByIdQuery(id!, {
    skip: !id, // Skip the query if no ID is provided
  });

  // Mutations for user actions
  const [updateUserStatus] = useUpdateUserStatusMutation();

  // Extract user data from API response
  const user = userResponse?.data;

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
  if (isError || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">User Not Found</h2>
          <p className="text-muted-foreground mt-2">
            {isError
              ? "Failed to load user details. Please try again."
              : "The user you're looking for doesn't exist."}
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
        return "destructive";
      case "INSTRUCTOR":
        return "default";
      case "STUDENT":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );
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
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-muted-foreground">ID: {user.id}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant={getRoleBadgeVariant(user.role)}>
                  {user.role}
                </Badge>
                <Badge
                  variant={user.isActive ? "default" : "destructive"}
                  className="flex items-center gap-1"
                >
                  {getStatusIcon(user.isActive)}
                  {user.isActive ? "Active" : "Banned"}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {user.lastLoginAt && (
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Last login{" "}
                      {new Date(user.lastLoginAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
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
                <div className="text-2xl font-bold">0</div>
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
                <div className="text-2xl font-bold">$0</div>
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
                <div className="text-2xl font-bold">0h</div>
                <p className="text-xs text-muted-foreground">
                  Total learning time
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Last Activity
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {user.lastLoginAt
                    ? new Date(user.lastLoginAt).toLocaleDateString()
                    : "Never"}
                </div>
                <p className="text-xs text-muted-foreground">Last login date</p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
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
                    Phone Number
                  </label>
                  <p className="font-medium">Not provided</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Registration Date
                  </label>
                  <p className="font-medium">
                    {new Date(user.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Last Updated
                  </label>
                  <p className="font-medium">
                    {new Date(user.updatedAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Account Status
                  </label>
                  <p className="font-medium flex items-center gap-2">
                    {getStatusIcon(user.isActive)}
                    {user.isActive ? "Active" : "Banned"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                <p className="text-muted-foreground">
                  This user hasn't enrolled in any courses yet.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No payments found
                </h3>
                <p className="text-muted-foreground">
                  This user hasn't made any payments yet.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No activity found
                </h3>
                <p className="text-muted-foreground">
                  No recent activity to display.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
