import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { UserDetail } from "../../../components/admin/UserDetail";
import {
  ArrowLeft,
  Edit,
  Shield,
  UserMinus,
  UserPlus,
  Loader2,
} from "lucide-react";
import {
  useGetUserByIdQuery,
  useUpdateUserStatusMutation,
} from "../../../services/usersApi";

export const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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
        <Loader2 className="h-8 w-8 animate-spin" />
        <h2 className="text-xl font-semibold">Loading user details...</h2>
      </div>
    );
  }

  // Error state
  if (isError || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <h2 className="text-2xl font-bold">User Not Found</h2>
        <p className="text-muted-foreground">
          {isError
            ? "Failed to load user details. Please try again."
            : "The user you're looking for doesn't exist."}
        </p>
        <Button onClick={() => navigate("/admin/users")}>
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
      // Example: await updateUserRole({ id: user.id, data: { role: "INSTRUCTOR" } });
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
              View and manage user information
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

      {/* User Detail Component */}
      <UserDetail
        user={user}
        courses={[]} // TODO: Fetch user's courses from API
        payments={[]} // TODO: Fetch user's payments from API
        logs={[]} // TODO: Fetch user's activity logs from API
      />
    </div>
  );
};
