import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { UserDetail } from "../../../components/admin/UserDetail";
import { ArrowLeft, Edit, Shield, UserMinus, UserPlus } from "lucide-react";
import {
  mockUsers,
  mockCourses,
  mockPayments,
  mockActivityLogs,
} from "../../../data/mockData";

export const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find user by ID
  const user = mockUsers.find((u) => u.id === id);
  const courses = mockCourses[id || ""] || [];
  const payments = mockPayments[id || ""] || [];
  const logs = mockActivityLogs[id || ""] || [];

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <h2 className="text-2xl font-bold">User Not Found</h2>
        <p className="text-muted-foreground">
          The user you're looking for doesn't exist.
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
  };

  const handleAssignRole = () => {
    console.log("Assign role to user:", user.id);
  };

  const handleBanUnban = () => {
    console.log(
      user.status === "ACTIVE" ? "Ban user:" : "Unban user:",
      user.id
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
          {user.status === "ACTIVE" ? (
            <Button variant="destructive" onClick={handleBanUnban}>
              <UserMinus className="mr-2 h-4 w-4" />
              Ban User
            </Button>
          ) : user.status === "BANNED" ? (
            <Button variant="default" onClick={handleBanUnban}>
              <UserPlus className="mr-2 h-4 w-4" />
              Unban User
            </Button>
          ) : null}
        </div>
      </div>

      {/* User Detail Component */}
      <UserDetail
        user={user}
        courses={courses}
        payments={payments}
        logs={logs}
      />
    </div>
  );
};
