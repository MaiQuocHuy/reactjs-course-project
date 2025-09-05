import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useGetUserPermissionsQuery } from "@/services/permissionsApi";
import { updateUserPermissions } from "@/store/authSlice";

interface PermissionProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that loads user permissions when authenticated
 * This component should wrap your app or major sections
 */
export const PermissionProvider: React.FC<PermissionProviderProps> = ({
  children,
}) => {
  const dispatch = useDispatch();
  const { isAuthenticated, permissions } = useSelector(
    (state: RootState) => state.auth
  );

  // Query user permissions when authenticated and permissions not loaded
  const {
    data: permissionsData,
    isLoading,
    error,
  } = useGetUserPermissionsQuery(undefined, {
    skip: !isAuthenticated || permissions.length > 0,
    pollingInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });

  // Update permissions in Redux store when data is loaded
  useEffect(() => {
    if (permissionsData?.data) {
      const { permissions: userPermissions, role } = permissionsData.data;
      dispatch(
        updateUserPermissions({
          permissions: userPermissions,
          userRole: role,
        })
      );
    }
  }, [permissionsData, dispatch]);

  // Log permission loading state for debugging
  useEffect(() => {
    if (isAuthenticated) {
      console.log("Permission Provider:", {
        isLoading,
        hasPermissions: permissions.length > 0,
        permissionCount: permissions.length,
        error: error ? "Error loading permissions" : null,
      });
    }
  }, [isAuthenticated, isLoading, permissions.length, error]);

  return <>{children}</>;
};

/**
 * Hook to check if permissions are loaded
 */
export const usePermissionsLoaded = () => {
  const { isAuthenticated, permissions } = useSelector(
    (state: RootState) => state.auth
  );
  const { isLoading } = useGetUserPermissionsQuery(undefined, {
    skip: !isAuthenticated || permissions.length > 0,
  });

  return {
    isLoaded: !isAuthenticated || permissions.length > 0,
    isLoading: isAuthenticated && isLoading,
  };
};
