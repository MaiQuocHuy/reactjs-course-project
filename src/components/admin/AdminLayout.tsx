import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import {
  Users,
  CreditCard,
  RefreshCw,
  Home,
  LogOut,
  Search,
  Menu,
  X,
  ChevronDown,
  HandCoins,
  BookOpen,
  FolderOpen,
  FileUser,
  Shield,
  UserCog,
  TicketPercent,
  Award,
} from "lucide-react";
import { Input } from "../ui/input";
import { useLogoutAdminMutation } from "@/services/authApi";
import { useGetAllCategoriesDropdownQuery } from "@/services/categoriesApi";
import { useGetPaymentStatisticsQuery } from "@/services/paymentsApi";
import { useGetRefundStatisticsQuery } from "@/services/refundsApi";
import { useGetApplicationsQuery } from "@/services/applicationsApi";
import { useGetRolesListQuery } from "@/services/rolesApi";
import { usePermissions } from "@/hooks/usePermissions";
import type { RootState } from "@/store/store";
import { NotificationTrigger } from "../notifications/NotificationTrigger";
import { useGetPendingCoursesQuery } from "@/services/coursesApi";

// Component to render navigation item with permission check
const PermissionNavigationItem: React.FC<{
  item: NavigationItem;
  isActive: (href: string) => boolean;
  setSidebarOpen: (open: boolean) => void;
}> = ({ item, isActive, setSidebarOpen }) => {
  // Get user role from Redux state - role is stored in auth.userRole.name
  const authUserRole = useSelector((state: RootState) => state.auth.userRole);
  const userRole = authUserRole?.name;
  const isAdmin = userRole === "ADMIN";

  // Always call hooks, but provide empty array if no permissions
  const permissions = item.permissions || [];
  const { hasAnyPermission } = usePermissions(permissions);

  // Logic for menu visibility:
  // 1. If item has permissions: check if user has any of those permissions
  // 2. If item has no permissions: only ADMIN can see it
  let shouldRender = false;

  if (permissions.length > 0) {
    // Has permissions defined - check if user has any of them
    shouldRender = hasAnyPermission;
  } else {
    // No permissions defined - only ADMIN can see
    shouldRender = isAdmin;
  }

  // If item should not be rendered, return null
  if (!shouldRender) {
    return null;
  }

  const Icon = item.icon;
  const active = isActive(item.href);

  return (
    <Link
      key={item.name}
      to={item.href}
      className={`
        flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
        ${
          active
            ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }
      `}
      onClick={() => setSidebarOpen(false)}
    >
      <div className="flex items-center space-x-3">
        <Icon className={`h-5 w-5 ${active ? "text-blue-600" : "text-gray-400"}`} />
        <span>{item.name}</span>
      </div>
      {item.badge && (
        <Badge variant={active ? "default" : "secondary"} className="h-5 text-xs">
          {item.badge}
        </Badge>
      )}
    </Link>
  );
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  permissions?: string[]; // Add optional permissions array
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const [logOut] = useLogoutAdminMutation();

  // Get user data from Redux store
  const user = useSelector((state: RootState) => state.auth.user);

  // Get categories count
  const { data: categoriesData } = useGetAllCategoriesDropdownQuery();
  const categoriesCount = categoriesData?.data?.length || 0;

  // Get pending / resubmitting courses count
  const { data: pendingCoursesData } = useGetPendingCoursesQuery({page: 0, size: 100});
  const pendingCoursesCount = pendingCoursesData?.content.length || 0;

  // Get payments count
  const { data: paymentStatistics } = useGetPaymentStatisticsQuery();
  const paymentsCount = paymentStatistics?.data?.pending || 0;

  // Get refund count
  const { data: refundStatistics } = useGetRefundStatisticsQuery();
  const refundsCount = refundStatistics?.data?.pending || 0;

  // Get all pending applications count
  const { data: pendingApplicationsCount } = useGetApplicationsQuery();
  const pendingCount =
    pendingApplicationsCount?.filter((app) => app.status === "PENDING").length || 0;

  // Get roles count
  const { data: rolesListData } = useGetRolesListQuery();
  const rolesCount = rolesListData?.data?.length || 0;

  // Get discounts count
  const { data: discountsListData } = useGetAllDiscountsQuery({});
  const discountsCount = (discountsListData && discountsListData.page.totalElements) || 0;

  const navigation: NavigationItem[] = [
    { name: "Dashboard", href: "/admin", icon: Home }, // No permission needed for dashboard
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
      badge: 12,
      permissions: ["user:READ"],
    },
    {
      name: "Applications",
      href: "/admin/applications",
      icon: FileUser,
      badge: pendingCount,
      permissions: ["instructor_application:READ"], // Updated to use specific application permissions
    },
    {
      name: "Categories",
      href: "/admin/categories",
      icon: FolderOpen,
      badge: categoriesCount,
      permissions: ["category:READ"],
    },
    {
      name: "Roles",
      href: "/admin/roles",
      icon: Shield,
      badge: rolesCount,
    },
    {
      name: "Assign Roles",
      href: "/admin/assign-roles",
      icon: UserCog,
    },
    {
      name: "Courses",
      href: "/admin/courses",
      icon: BookOpen,
      badge: pendingCoursesCount,
      permissions: ["course:READ"],
    },
    { name: "Certificates", href: "/admin/certificates", icon: Award },
    {
      name: "Revenues",
      href: "/admin/revenues",
      icon: HandCoins,
    },
    {
      name: "Affiliate Revenue",
      href: "/admin/affiliate-revenue",
      icon: Users,
    },
    {
      name: "Payments",
      href: "/admin/payments",
      icon: CreditCard,
      badge: paymentsCount,
      permissions: ["payment:READ"],
    },
    {
      name: "Refunds",
      href: "/admin/refunds",
      icon: RefreshCw,
      badge: refundsCount,
      permissions: ["refund:READ"],
    },
    {
      name: "Discounts",
      href: "/admin/discounts",
      icon: TicketPercent,
    },
    // {
    //   name: "Permission Demo",
    //   href: "/admin/permission-system-demo",
    //   icon: Lock,
    //   // No permission needed for demo page
    // },
  ];

  const handleLogout = async () => {
    try {
      await logOut().unwrap();
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      window.location.href = "/login"; // Redirect to login after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const isActive = (href: string) => {
    if (href === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-gray-50/50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:flex lg:flex-shrink-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SE</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Sybau Admin</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto">
            <div className="px-4 py-6 space-y-2">
              {navigation.map((item) => (
                <PermissionNavigationItem
                  key={item.name}
                  item={item}
                  isActive={isActive}
                  setSidebarOpen={setSidebarOpen}
                />
              ))}
            </div>
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.thumbnailUrl || "/api/placeholder/32/32"} />
                <AvatarFallback>
                  {user?.name
                    ? user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : "AD"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || "Admin User"}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email || "admin@sybau.edu"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content - flex-1 để chiếm toàn bộ không gian còn lại */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0 z-30">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>

              {/* Search */}
              {!location.pathname.includes("/admin/revenues") && (
                <div className="relative hidden sm:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search users, payments..."
                    className="pl-10 w-80 bg-gray-50 border-0 focus:bg-white"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <NotificationTrigger />

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.thumbnailUrl || "/api/placeholder/32/32"} />
                      <AvatarFallback>
                        {user?.name
                          ? user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          : "AD"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:block text-sm font-medium">
                      {user?.name || "Admin User"}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    My Account
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || "No email"}
                    </p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content - flex-1 để chiếm toàn bộ không gian còn lại */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8 h-full">{children}</div>
        </main>
      </div>
    </div>
  );
};
