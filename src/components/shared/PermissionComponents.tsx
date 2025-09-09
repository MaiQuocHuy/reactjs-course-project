import React from "react";
import { usePermission, usePermissions } from "@/hooks/usePermissions";

interface PermissionGateProps {
  permission?: string;
  permissions?: string[];
  requireAll?: boolean; // true = require all permissions, false = require any
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Component to conditionally render content based on user permissions
 * Hides content completely when user doesn't have permission
 */
export const PermissionGate: React.FC<PermissionGateProps> = ({
  permission,
  permissions = [],
  requireAll = false,
  fallback = null,
  children,
}) => {
  // Handle single permission
  const { hasPermission: hasSinglePermission } = usePermission(
    permission || ""
  );

  // Handle multiple permissions
  const { hasAllPermissions, hasAnyPermission } = usePermissions(permissions);

  // Determine if user has required permissions
  let hasRequiredPermissions = false;

  if (permission) {
    hasRequiredPermissions = hasSinglePermission;
  } else if (permissions.length > 0) {
    hasRequiredPermissions = requireAll ? hasAllPermissions : hasAnyPermission;
  }

  if (!hasRequiredPermissions) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

interface PermissionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * Button component that gets disabled when user doesn't have permission
 * Shows button but in disabled state - follows your requirement for disabled state only
 */
export const PermissionButton: React.FC<PermissionButtonProps> = ({
  permission,
  permissions = [],
  requireAll = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  // Handle single permission
  const { hasPermission: hasSinglePermission } = usePermission(
    permission || ""
  );

  // Handle multiple permissions
  const { hasAllPermissions, hasAnyPermission } = usePermissions(permissions);

  // Determine if user has required permissions
  let hasRequiredPermissions = false;

  if (permission) {
    hasRequiredPermissions = hasSinglePermission;
  } else if (permissions.length > 0) {
    hasRequiredPermissions = requireAll ? hasAllPermissions : hasAnyPermission;
  }

  const isDisabled = disabled || !hasRequiredPermissions;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={`${className} ${
        isDisabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      title={
        !hasRequiredPermissions
          ? "You do not have permission to perform this action"
          : undefined
      }
    >
      {children}
    </button>
  );
};

interface PermissionWrapperProps {
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  mode?: "hide" | "disable"; // 'hide' completely hides, 'disable' shows but disabled
  children: React.ReactElement;
  className?: string;
}

/**
 * Higher-order component that wraps any element with permission checking
 * Can either hide the element or disable it based on mode
 */
export const PermissionWrapper: React.FC<PermissionWrapperProps> = ({
  permission,
  permissions = [],
  requireAll = false,
  mode = "disable",
  children,
  className = "",
}) => {
  // Handle single permission
  const { hasPermission: hasSinglePermission } = usePermission(
    permission || ""
  );

  // Handle multiple permissions
  const { hasAllPermissions, hasAnyPermission } = usePermissions(permissions);

  // Determine if user has required permissions
  let hasRequiredPermissions = false;

  if (permission) {
    hasRequiredPermissions = hasSinglePermission;
  } else if (permissions.length > 0) {
    hasRequiredPermissions = requireAll ? hasAllPermissions : hasAnyPermission;
  }

  if (mode === "hide" && !hasRequiredPermissions) {
    return null;
  }

  if (mode === "disable" && !hasRequiredPermissions) {
    const childProps = children.props as any;
    return React.cloneElement(children, {
      ...childProps,
      disabled: true,
      className: `${
        childProps.className || ""
      } ${className} opacity-50 cursor-not-allowed`,
      title: "You do not have permission to perform this action",
    });
  }

  const childProps = children.props as any;
  return React.cloneElement(children, {
    ...childProps,
    className: `${childProps.className || ""} ${className}`,
  });
};
