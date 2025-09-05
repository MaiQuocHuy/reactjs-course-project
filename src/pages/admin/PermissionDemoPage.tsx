import React from "react";
import {
  PermissionGate,
  PermissionButton,
  PermissionWrapper,
} from "@/components/shared/PermissionComponents";
import {
  useCoursePermissions,
  useAdminPermissions,
  useUserRole,
} from "@/hooks/usePermissions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PermissionDemoPage: React.FC = () => {
  const coursePermissions = useCoursePermissions();
  const adminPermissions = useAdminPermissions();
  const { userRole, isAdmin, isInstructor, isStudent } = useUserRole();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Permission System Demo
        </h1>
        <p className="text-gray-600 mt-2">
          This page demonstrates the permission-based UI control system.
        </p>
      </div>

      {/* User Role Information */}
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>Current user role and status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">Role:</span>
            <Badge
              variant={
                isAdmin ? "default" : isInstructor ? "secondary" : "outline"
              }
            >
              {userRole?.name || "Unknown"}
            </Badge>
          </div>
          <div className="flex gap-4 text-sm">
            <span className={`${isAdmin ? "text-green-600" : "text-gray-400"}`}>
              Admin: {isAdmin ? "✓" : "✗"}
            </span>
            <span
              className={`${isInstructor ? "text-green-600" : "text-gray-400"}`}
            >
              Instructor: {isInstructor ? "✓" : "✗"}
            </span>
            <span
              className={`${isStudent ? "text-green-600" : "text-gray-400"}`}
            >
              Student: {isStudent ? "✓" : "✗"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Course Permissions Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Course Permissions</CardTitle>
          <CardDescription>
            Course-related actions based on user permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* View Courses - Most users should have this */}
            <PermissionButton
              permission="course:READ"
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              View Courses
            </PermissionButton>

            {/* Create Course - Usually instructor/admin */}
            <PermissionButton
              permission="course:CREATE"
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Create Course
            </PermissionButton>

            {/* Update Course - Usually instructor/admin */}
            <PermissionButton
              permission="course:UPDATE"
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              Update Course
            </PermissionButton>

            {/* Delete Course - Usually admin only */}
            <PermissionButton
              permission="course:DELETE"
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete Course
            </PermissionButton>

            {/* Enroll Course - Usually student */}
            <PermissionButton
              permission="enrollment:CREATE"
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              Enroll Course
            </PermissionButton>

            {/* Purchase Course - Usually student */}
            <PermissionButton
              permission="payment:CREATE"
              className="bg-indigo-500 hover:bg-indigo-600 text-white"
            >
              Purchase Course
            </PermissionButton>
          </div>

          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <strong>Permission Status:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                View Courses:{" "}
                {coursePermissions.canViewCourses ? "✓ Allowed" : "✗ Denied"}
              </li>
              <li>
                Create Course:{" "}
                {coursePermissions.canCreateCourse ? "✓ Allowed" : "✗ Denied"}
              </li>
              <li>
                Update Course:{" "}
                {coursePermissions.canUpdateCourse ? "✓ Allowed" : "✗ Denied"}
              </li>
              <li>
                Delete Course:{" "}
                {coursePermissions.canDeleteCourse ? "✓ Allowed" : "✗ Denied"}
              </li>
              <li>
                Enroll Course:{" "}
                {coursePermissions.canEnrollCourse ? "✓ Allowed" : "✗ Denied"}
              </li>
              <li>
                Purchase Course:{" "}
                {coursePermissions.canPurchaseCourse ? "✓ Allowed" : "✗ Denied"}
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Admin Permissions Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Permissions</CardTitle>
          <CardDescription>
            Administrative actions - only visible to users with admin
            permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* This section is hidden completely if user doesn't have admin permissions */}
          <PermissionGate
            permission="user:READ"
            fallback={
              <div className="text-gray-500 italic">
                You don't have permission to see admin features.
              </div>
            }
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <PermissionButton
                permission="user:READ"
                className="bg-gray-600 hover:bg-gray-700 text-white"
              >
                View Users
              </PermissionButton>

              <PermissionButton
                permission="user:CREATE"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Create User
              </PermissionButton>

              <PermissionButton
                permission="role:READ"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                View Roles
              </PermissionButton>

              <PermissionButton
                permission="role:CREATE"
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Create Role
              </PermissionButton>
            </div>

            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <strong>Admin Permission Status:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  View Users:{" "}
                  {adminPermissions.canViewUsers ? "✓ Allowed" : "✗ Denied"}
                </li>
                <li>
                  Create User:{" "}
                  {adminPermissions.canCreateUser ? "✓ Allowed" : "✗ Denied"}
                </li>
                <li>
                  View Roles:{" "}
                  {adminPermissions.canViewRoles ? "✓ Allowed" : "✗ Denied"}
                </li>
                <li>
                  Create Role:{" "}
                  {adminPermissions.canCreateRole ? "✓ Allowed" : "✗ Denied"}
                </li>
              </ul>
            </div>
          </PermissionGate>
        </CardContent>
      </Card>

      {/* Permission Wrapper Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Permission Wrapper Demo</CardTitle>
          <CardDescription>
            Examples of different permission control modes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">
                Mode: Disable (shows button but disabled)
              </h4>
              <PermissionWrapper permission="course:DELETE" mode="disable">
                <Button className="bg-red-500 hover:bg-red-600 text-white">
                  Delete Course (Disabled Mode)
                </Button>
              </PermissionWrapper>
            </div>

            <div>
              <h4 className="font-medium mb-2">
                Mode: Hide (completely hides button)
              </h4>
              <PermissionWrapper permission="course:DELETE" mode="hide">
                <Button className="bg-red-500 hover:bg-red-600 text-white">
                  Delete Course (Hidden Mode)
                </Button>
              </PermissionWrapper>
              {!coursePermissions.canDeleteCourse && (
                <p className="text-sm text-gray-500 italic">
                  (Button is hidden because you don't have delete permission)
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Multiple Permissions Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Multiple Permissions Demo</CardTitle>
          <CardDescription>
            Actions requiring multiple permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">
                Requires ANY of the permissions
              </h4>
              <PermissionButton
                permissions={["course:CREATE", "course:UPDATE"]}
                requireAll={false}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Create OR Update Course
              </PermissionButton>
            </div>

            <div>
              <h4 className="font-medium mb-2">Requires ALL permissions</h4>
              <PermissionButton
                permissions={["course:READ", "course:UPDATE"]}
                requireAll={true}
                className="bg-teal-500 hover:bg-teal-600 text-white"
              >
                Read AND Update Course
              </PermissionButton>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PermissionDemoPage;
