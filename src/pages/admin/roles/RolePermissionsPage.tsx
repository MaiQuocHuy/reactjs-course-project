import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Checkbox } from "../../../components/ui/checkbox";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { ArrowLeft, Shield, Save, Search } from "lucide-react";
import { Input } from "../../../components/ui/input";
import {
  // useGetRoleByIdQuery,
  useGetAllPermissionsQuery,
  useAssignPermissionsMutation,
} from "../../../services/rolesApi";
import type { Permission } from "../../../types/roles";
import { toast } from "sonner";

// Group permissions by resource
const groupPermissionsByResource = (permissions: Permission[]) => {
  const grouped = permissions.reduce((acc, permission) => {
    const resourceName = permission.resource?.name || "Unknown Resource";
    if (!acc[resourceName]) {
      acc[resourceName] = [];
    }
    acc[resourceName].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return grouped;
};

// Get action type color
const getActionTypeColor = (actionKey: string) => {
  if (!actionKey) return "bg-gray-100 text-gray-800 border-gray-200";

  switch (actionKey.toLowerCase()) {
    case "create":
      return "bg-green-100 text-green-800 border-green-200";
    case "read":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "update":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "delete":
      return "bg-red-100 text-red-800 border-red-200";
    case "publish":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "approve":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "enroll":
      return "bg-cyan-100 text-cyan-800 border-cyan-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const RolePermissionsPage: React.FC = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();

  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set()
  );
  const [searchTerm, setSearchTerm] = useState("");

  // API calls
  // const {
  //   data: roleData,
  //   isLoading: roleLoading,
  //   error: roleError,
  // } = useGetRoleByIdQuery(roleId || "");
  const { data: permissionsData, isLoading: permissionsLoading } =
    useGetAllPermissionsQuery();
  const [assignPermissions, { isLoading: isAssigning }] =
    useAssignPermissionsMutation();

  // Temporary mock role data for testing
  const roleData = useMemo(
    () => ({
      data: {
        id: roleId || "",
        name: "DEV", // Mock role name for testing
        description: "Developer role",
        permissions: [] as Permission[],
      },
    }),
    [roleId]
  );
  const roleLoading = false;
  const roleError = null;

  // Debug: Log API responses (only when data changes)
  useEffect(() => {
    if (permissionsData) {
      console.log("Role Data:", roleData);
      console.log("Permissions Data:", permissionsData);
    }
  }, [permissionsData?.data?.length]); // Only log when permissions actually change

  // Initialize selected permissions when role data is loaded
  useEffect(() => {
    if (roleData?.data?.permissions?.length > 0) {
      const currentPermissionKeys = new Set(
        roleData.data.permissions.map((p) => p.key)
      );
      setSelectedPermissions(currentPermissionKeys);
    }
  }, [roleData.data.id]); // Only depend on role ID, not the whole object

  // Remove the empty useEffect
  // useEffect(() => {
  //   // Resources are auto-expanded by default, no need to track state
  // }, [permissionsData]);

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(permissionId)) {
        newSet.delete(permissionId);
      } else {
        newSet.add(permissionId);
      }
      return newSet;
    });
  };

  const handleResourceToggle = (
    _resourceName: string,
    permissions: Permission[]
  ) => {
    const resourcePermissionKeys = permissions.map((p) => p.key);
    const allSelected = resourcePermissionKeys.every((key) =>
      selectedPermissions.has(key)
    );

    setSelectedPermissions((prev) => {
      const newSet = new Set(prev);
      if (allSelected) {
        // Unselect all permissions in this resource
        resourcePermissionKeys.forEach((key) => newSet.delete(key));
      } else {
        // Select all permissions in this resource
        resourcePermissionKeys.forEach((key) => newSet.add(key));
      }
      return newSet;
    });
  };

  const handleSave = async () => {
    if (!roleId) return;

    try {
      await assignPermissions({
        id: roleId,
        data: { permissionIds: Array.from(selectedPermissions) },
      }).unwrap();

      toast.success("Permissions assigned successfully!");
    } catch (error: any) {
      console.error("Failed to assign permissions:", error);
      toast.error(error?.data?.message || "Failed to assign permissions");
    }
  };

  if (roleLoading || permissionsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (roleError || !roleData?.data || !permissionsData?.data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading data</p>
          <Button onClick={() => navigate("/admin/roles")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Roles
          </Button>
        </div>
      </div>
    );
  }

  const role = roleData.data;
  const allPermissions = permissionsData.data || [];

  // Filter permissions by search term
  const filteredPermissions = allPermissions.filter((permission) => {
    if (!permission) return false;
    return (
      permission.permissionKey
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      permission.description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      permission.resource?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      permission.action?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Group filtered permissions by resource
  const groupedPermissions = groupPermissionsByResource(filteredPermissions);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate("/admin/roles")}
            variant="ghost"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Roles List
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Shield className="h-6 w-6 mr-2 text-blue-600" />
              Assign permissions for{" "}
              <Badge variant="secondary" className="ml-2 text-sm">
                {role.name}
              </Badge>{" "}
              role
            </h1>
            <p className="text-gray-600 mt-1">
              Select permissions to assign to this role
            </p>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={isAssigning}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isAssigning ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search permissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Permissions List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Available Permissions</span>
            <Badge variant="outline">
              {selectedPermissions.size} of {allPermissions.length} selected
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {Object.entries(groupedPermissions).map(
                ([resourceName, permissions]) => {
                  const resourcePermissionKeys = permissions.map((p) => p.key);
                  const selectedCount = resourcePermissionKeys.filter((key) =>
                    selectedPermissions.has(key)
                  ).length;
                  const allSelected =
                    selectedCount === resourcePermissionKeys.length;

                  return (
                    <Card key={resourceName} className="border border-gray-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={allSelected}
                              onCheckedChange={() =>
                                handleResourceToggle(resourceName, permissions)
                              }
                            />
                            <h3 className="font-semibold text-lg capitalize">
                              {resourceName}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              {selectedCount}/{permissions.length}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                          {permissions.map((permission) => (
                            <div
                              key={permission.key}
                              className={`border rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                                selectedPermissions.has(permission.key)
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                              onClick={() =>
                                handlePermissionToggle(permission.key)
                              }
                            >
                              <div className="flex items-start space-x-2">
                                <Checkbox
                                  checked={selectedPermissions.has(
                                    permission.key
                                  )}
                                  onChange={() => {}} // Handled by parent click
                                  className="mt-0.5"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <code className="text-xs bg-gray-100 px-1 py-0.5 rounded text-gray-800 font-mono">
                                      {permission.key || "Unknown Permission"}
                                    </code>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                    {permission.description || "No description"}
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">
                                      {permission.action?.name ||
                                        "Unknown Action"}
                                    </span>
                                    <Badge
                                      variant="outline"
                                      className={`text-xs ${getActionTypeColor(
                                        permission.action?.key || "unknown"
                                      )}`}
                                    >
                                      {permission.action?.key || "Unknown"}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                }
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
