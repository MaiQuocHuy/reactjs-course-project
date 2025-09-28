import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

interface PrivateRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * PrivateRoute component that protects routes requiring authentication
 * Redirects to /login if user is not authenticated
 */
export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, redirectTo = "/login" }) => {
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login with the current location
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If authenticated, render the protected component
  return <>{children}</>;
};

/**
 * PublicRoute component that redirects authenticated users away from public-only pages (like login)
 */
interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children, redirectTo = "/admin" }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // If authenticated, redirect to admin dashboard
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // If not authenticated, render the public component (like login form)
  return <>{children}</>;
};
