import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { useCheckPermissionQuery } from '@/services/permissionsApi';

/**
 * Hook to check if user has a specific permission
 */
export const usePermission = (permissionKey: string) => {
  const permissions = useSelector((state: RootState) => state.auth.permissions);
  
  // Check from cached permissions first
  const hasPermissionCached = permissions.includes(permissionKey);
  
  // Use API query as fallback or for real-time checking
  const { data: permissionCheck, isLoading } = useCheckPermissionQuery(permissionKey, {
    skip: hasPermissionCached, // Skip API call if already in cache
  });
  
  const hasPermission = hasPermissionCached || permissionCheck?.data || false;
  
  return {
    hasPermission,
    isLoading,
  };
};

/**
 * Hook to check multiple permissions
 */
export const usePermissions = (permissionKeys: string[]) => {
  const permissions = useSelector((state: RootState) => state.auth.permissions);
  
  const checkPermission = useCallback((key: string) => {
    return permissions.includes(key);
  }, [permissions]);
  
  const hasAllPermissions = useCallback(() => {
    return permissionKeys.every(key => permissions.includes(key));
  }, [permissionKeys, permissions]);
  
  const hasAnyPermission = useCallback(() => {
    return permissionKeys.some(key => permissions.includes(key));
  }, [permissionKeys, permissions]);
  
  const getPermissionStatus = useCallback(() => {
    return permissionKeys.reduce((acc, key) => {
      acc[key] = permissions.includes(key);
      return acc;
    }, {} as Record<string, boolean>);
  }, [permissionKeys, permissions]);
  
  return {
    checkPermission,
    hasAllPermissions: hasAllPermissions(),
    hasAnyPermission: hasAnyPermission(),
    permissionStatus: getPermissionStatus(),
  };
};

/**
 * Hook to get user role information
 */
export const useUserRole = () => {
  const userRole = useSelector((state: RootState) => state.auth.userRole);
  const user = useSelector((state: RootState) => state.auth.user);
  
  const isAdmin = userRole?.name === 'ADMIN' || user?.role === 'ADMIN';
  const isInstructor = userRole?.name === 'INSTRUCTOR' || user?.role === 'INSTRUCTOR';
  const isStudent = userRole?.name === 'STUDENT' || user?.role === 'STUDENT';
  
  return {
    userRole,
    isAdmin,
    isInstructor,
    isStudent,
    roleName: userRole?.name || user?.role,
  };
};

/**
 * Hook for common course-related permissions
 */
export const useCoursePermissions = () => {
  const { permissionStatus } = usePermissions([
    'course:READ',
    'course:CREATE',
    'course:UPDATE', 
    'course:DELETE',
    'enrollment:CREATE',
    'payment:CREATE',
  ]);
  
  return {
    canViewCourses: permissionStatus['course:READ'],
    canCreateCourse: permissionStatus['course:CREATE'],
    canUpdateCourse: permissionStatus['course:UPDATE'],
    canDeleteCourse: permissionStatus['course:DELETE'],
    canEnrollCourse: permissionStatus['enrollment:CREATE'],
    canPurchaseCourse: permissionStatus['payment:CREATE'],
  };
};

/**
 * Hook for admin-related permissions
 */
export const useAdminPermissions = () => {
  const { permissionStatus } = usePermissions([
    'user:READ',
    'user:CREATE',
    'user:UPDATE',
    'user:DELETE',
    'role:READ',
    'role:CREATE',
    'role:UPDATE',
    'role:DELETE',
    'permission:READ',
  ]);
  
  return {
    canViewUsers: permissionStatus['user:READ'],
    canCreateUser: permissionStatus['user:CREATE'],
    canUpdateUser: permissionStatus['user:UPDATE'],
    canDeleteUser: permissionStatus['user:DELETE'],
    canViewRoles: permissionStatus['role:READ'],
    canCreateRole: permissionStatus['role:CREATE'],
    canUpdateRole: permissionStatus['role:UPDATE'],
    canDeleteRole: permissionStatus['role:DELETE'],
    canViewPermissions: permissionStatus['permission:READ'],
  };
};
