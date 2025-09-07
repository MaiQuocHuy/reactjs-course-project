import React from "react";
import {
  PermissionGate,
  PermissionButton,
  PermissionWrapper,
} from "@/components/shared/PermissionComponents";
import { usePermission, useUserRole } from "@/hooks/usePermissions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Users,
  CreditCard,
  UserPlus,
  Edit,
  Trash2,
  Eye,
  Settings,
  Shield,
  Download,
} from "lucide-react";

const AdminPermissionDemoPage: React.FC = () => {
  const { userRole, isAdmin, isInstructor } = useUserRole();
  const { hasPermission: canManageUsers } = usePermission("user:UPDATE");
  const { hasPermission: canCreateCourses } = usePermission("course:CREATE");

  // Simulate some data
  const mockCourses = [
    {
      id: "1",
      title: "React Fundamentals",
      instructor: "John Doe",
      status: "published",
    },
    {
      id: "2",
      title: "Advanced JavaScript",
      instructor: "Jane Smith",
      status: "pending",
    },
    {
      id: "3",
      title: "Python for Beginners",
      instructor: "Bob Wilson",
      status: "draft",
    },
  ];

  const mockUsers = [
    { id: "1", name: "Alice Johnson", role: "STUDENT", status: "active" },
    { id: "2", name: "Bob Smith", role: "INSTRUCTOR", status: "active" },
    { id: "3", name: "Charlie Brown", role: "ADMIN", status: "active" },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Admin Permission System Demo
        </h1>
        <p className="text-gray-600 mt-2">
          Real-world demonstration of permission-based UI controls in admin
          interface.
        </p>
      </div>

      {/* User Role Information */}
      <Card>
        <CardHeader>
          <CardTitle>Current User Information</CardTitle>
          <CardDescription>
            Your current role and admin permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="font-medium">Role:</span>
            <Badge
              variant={
                isAdmin ? "default" : isInstructor ? "secondary" : "outline"
              }
            >
              {userRole?.name || "Not logged in"}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Shield className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="font-semibold">Admin Status</div>
              <div className="text-sm text-gray-600">
                {isAdmin ? "Admin User" : "Non-Admin User"}
              </div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="font-semibold">User Management</div>
              <div className="text-sm text-gray-600">
                {canManageUsers ? "Can manage users" : "Cannot manage users"}
              </div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="font-semibold">Course Creation</div>
              <div className="text-sm text-gray-600">
                {canCreateCourses
                  ? "Can create courses"
                  : "Cannot create courses"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Management Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Course Management
          </CardTitle>
          <CardDescription>
            Permission-controlled course management interface
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <PermissionButton
              permissions={["course:CREATE"]}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Create Course
            </PermissionButton>

            <PermissionButton
              permissions={["course:UPDATE"]}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
            >
              <Edit className="mr-2 h-4 w-4" />
              Bulk Edit
            </PermissionButton>

            <PermissionButton
              permissions={["course:DELETE"]}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground shadow hover:bg-destructive/90 h-9 px-4 py-2"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected
            </PermissionButton>

            <PermissionButton
              permissions={["course:READ"]}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </PermissionButton>
          </div>

          {/* Course List */}
          <PermissionGate permissions={["course:READ"]}>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Instructor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockCourses.map((course) => (
                    <tr key={course.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {course.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {course.instructor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant={
                            course.status === "published"
                              ? "default"
                              : course.status === "pending"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {course.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <PermissionButton
                          permissions={["course:READ"]}
                          className="text-indigo-600 hover:text-indigo-900 inline-flex items-center text-sm"
                        >
                          <Eye className="mr-1 h-4 w-4" />
                          View
                        </PermissionButton>

                        <PermissionButton
                          permissions={["course:UPDATE"]}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center text-sm"
                        >
                          <Edit className="mr-1 h-4 w-4" />
                          Edit
                        </PermissionButton>

                        <PermissionButton
                          permissions={["course:DELETE"]}
                          className="text-red-600 hover:text-red-900 inline-flex items-center text-sm"
                        >
                          <Trash2 className="mr-1 h-4 w-4" />
                          Delete
                        </PermissionButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </PermissionGate>
        </CardContent>
      </Card>

      {/* User Management Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
          <CardDescription>Admin-only user management features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* User Management Actions */}
          <div className="flex gap-2 flex-wrap">
            <PermissionButton
              permissions={["user:CREATE"]}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </PermissionButton>

            <PermissionButton
              permissions={["user:UPDATE"]}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
            >
              <Settings className="mr-2 h-4 w-4" />
              Manage Roles
            </PermissionButton>
          </div>

          {/* User List */}
          <PermissionGate permissions={["user:READ"]}>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant={
                            user.role === "ADMIN"
                              ? "default"
                              : user.role === "INSTRUCTOR"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="default">{user.status}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <PermissionButton
                          permissions={["user:READ"]}
                          className="text-indigo-600 hover:text-indigo-900 inline-flex items-center text-sm"
                        >
                          <Eye className="mr-1 h-4 w-4" />
                          View
                        </PermissionButton>

                        <PermissionButton
                          permissions={["user:UPDATE"]}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center text-sm"
                        >
                          <Edit className="mr-1 h-4 w-4" />
                          Edit
                        </PermissionButton>

                        <PermissionButton
                          permissions={["user:UPDATE"]}
                          className="text-green-600 hover:text-green-900 inline-flex items-center text-sm"
                        >
                          <Shield className="mr-1 h-4 w-4" />
                          Roles
                        </PermissionButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </PermissionGate>
        </CardContent>
      </Card>

      {/* Payment Management Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Management
          </CardTitle>
          <CardDescription>Financial data and payment controls</CardDescription>
        </CardHeader>
        <CardContent>
          <PermissionGate
            permissions={["payment:READ"]}
            fallback={
              <div className="text-center py-8 text-gray-500">
                <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>You don't have permission to view payment information.</p>
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">$12,450</div>
                <div className="text-sm text-green-700">Total Revenue</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">234</div>
                <div className="text-sm text-blue-700">Transactions</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">$52.10</div>
                <div className="text-sm text-purple-700">Avg. Order</div>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <PermissionButton
                permissions={["payment:READ"]}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
              >
                <Download className="mr-2 h-4 w-4" />
                Export Reports
              </PermissionButton>

              <PermissionButton
                permissions={["payment:UPDATE"]}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
              >
                <Settings className="mr-2 h-4 w-4" />
                Manage Refunds
              </PermissionButton>
            </div>
          </PermissionGate>
        </CardContent>
      </Card>

      {/* Multiple Permissions Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Permission Scenarios</CardTitle>
          <CardDescription>
            Testing complex permission combinations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Require ALL permissions */}
          <div>
            <h4 className="font-semibold mb-2">
              Require ALL permissions (Admin Only):
            </h4>
            <PermissionWrapper
              permissions={["user:UPDATE", "course:UPDATE", "payment:READ"]}
              requireAll={true}
              mode="disable"
            >
              <Button className="w-full">
                🔒 Admin Dashboard Access (Needs ALL: user:UPDATE +
                course:UPDATE + payment:READ)
              </Button>
            </PermissionWrapper>
          </div>

          {/* Require ANY permission */}
          <div>
            <h4 className="font-semibold mb-2">
              Require ANY permission (Content Manager):
            </h4>
            <PermissionWrapper
              permissions={["course:CREATE", "course:UPDATE", "user:READ"]}
              requireAll={false}
              mode="disable"
            >
              <Button variant="outline" className="w-full">
                📚 Content Management Access (Needs ANY: course:CREATE OR
                course:UPDATE OR user:READ)
              </Button>
            </PermissionWrapper>
          </div>

          {/* Single specific permission */}
          <div>
            <h4 className="font-semibold mb-2">Single permission check:</h4>
            <PermissionWrapper permissions={["course:READ"]} mode="disable">
              <Button variant="secondary" className="w-full">
                📖 View Course Analytics (Needs: course:READ)
              </Button>
            </PermissionWrapper>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPermissionDemoPage;
