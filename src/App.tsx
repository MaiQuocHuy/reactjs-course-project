import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import { AdminLayout } from "./components/admin/AdminLayout";
import { DashboardPage } from "./pages/Dashboard/DashboardPage";
import { UsersListPage } from "./pages/admin/users";
import { UserDetailPage } from "./pages/admin/users";
import { PaymentsPage } from "./pages/payments";
import { PaymentDetailPage } from "./pages/payments/PaymentDetailPage";
import RefundsPage from "./pages/refunds";
import { ApplicationDetail } from "./components/ApplicationDetail/ApplicationDetail";
import { ApplicationsListPage } from "./pages/ApplicationList";
import CoursesPage from "./pages/courses/CoursesPage";
import CourseDetailPage from "./pages/courses/course-detail/CourseDetailPage";
import CourseReviewDetailPage from "./pages/courses/course-detail/CourseReviewDetailPage";
import AffiliateRevenueManagementPage from "./pages/admin/AffiliateRevenueManagementPage";
import { Toaster } from "@/components/ui/sonner";
import { RefundDetailPage } from "./pages/refunds/RefundDetailPage";
import { CategoriesListPage } from "./pages/admin/categories/CategoriesListPage";
import { RolesListPage } from "./pages/admin/roles";
import AdminCertificatesPage from "./pages/certificates";
import { PermissionProvider } from "@/components/providers/PermissionProvider";
import PermissionDemoPage from "./pages/admin/PermissionDemoPage";
import AdminPermissionDemoPage from "./pages/admin/AdminPermissionDemoPage";
import { AssignRoleToUsersPage } from "./pages/admin/users/AssignRoleToUsersPage";
import DiscountsPage from "./pages/discounts/DiscountsPage";
import RevenuesPage2 from "./pages/revenues/RevenuesPage";
import { PrivateRoute, PublicRoute } from "./components/auth/PrivateRoute";

function App() {
  return (
    <div className="h-screen w-screen m-0 p-0 overflow-hidden">
      <PermissionProvider>
        <Router>
          <Routes>
            {/* Public routes (redirect to admin if already logged in) */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginForm />
                </PublicRoute>
              }
            />

            {/* Protected Admin routes */}
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminLayout>
                    <DashboardPage />
                  </AdminLayout>
                </PrivateRoute>
              }
            />

            {/* Permission Demo */}
            <Route
              path="/admin/permissions-demo"
              element={
                <PrivateRoute>
                  <AdminLayout>
                    <PermissionDemoPage />
                  </AdminLayout>
                </PrivateRoute>
              }
            />

            {/* Real Admin Permission Demo */}
            <Route
              path="/admin/permission-system-demo"
              element={
                <PrivateRoute>
                  <AdminLayout>
                    <AdminPermissionDemoPage />
                  </AdminLayout>
                </PrivateRoute>
              }
            />

            {/* Users */}
            <Route
              path="/admin/users"
              element={
                <PrivateRoute>
                  <AdminLayout>
                    <UsersListPage />
                  </AdminLayout>
                </PrivateRoute>
              }
            />
            {/* User Detail */}
            <Route
              path="/admin/users/:id"
              element={
                <PrivateRoute>
                  <AdminLayout>
                    <UserDetailPage />
                  </AdminLayout>
                </PrivateRoute>
              }
            />

            {/* Assign Roles to Users */}
            <Route
              path="/admin/assign-roles"
              element={
                <PrivateRoute>
                  <AdminLayout>
                    <AssignRoleToUsersPage />
                  </AdminLayout>
                </PrivateRoute>
              }
            />

            {/* Courses */}
            <Route
              path="/admin/courses"
              element={
                <PrivateRoute>
                  <AdminLayout>
                    <CoursesPage />
                  </AdminLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/pending-courses"
              element={
                <PrivateRoute>
                  <AdminLayout>
                    <CoursesPage />
                  </AdminLayout>
                </PrivateRoute>
              }
            />
            {/* Course Detail */}
            <Route
              path="/admin/courses/:id"
              element={
                <PrivateRoute>
                  <AdminLayout>
                    <CourseDetailPage />
                  </AdminLayout>
                </PrivateRoute>
              }
            />
            {/* Course Review Detail */}
            <Route
              path="/admin/courses/review-course/:id"
              element={
                <PrivateRoute>
                  <AdminLayout>
                    <CourseReviewDetailPage />
                  </AdminLayout>
                </PrivateRoute>
              }
            />

            {/* Certificates */}
            <Route
              path="/admin/certificates"
              element={
                <PrivateRoute>
                  <AdminLayout>
                    <AdminCertificatesPage />
                  </AdminLayout>
                </PrivateRoute>
              }
            />

            {/* Revenues */}
            <Route
              path="/admin/revenues"
              element={
                <PrivateRoute>
                  <AdminLayout>
                    <RevenuesPage2 />
                  </AdminLayout>
                </PrivateRoute>
              }
            />

            {/* Affiliate Revenue Management */}
            <Route
              path="/admin/affiliate-revenue"
              element={
                <PrivateRoute>
                  <AdminLayout>
                    <AffiliateRevenueManagementPage />
                  </AdminLayout>
                </PrivateRoute>
              }
            />

            {/* Categories */}
            <Route
              path="/admin/categories"
              element={
                <PrivateRoute>
                  <AdminLayout>
                    <CategoriesListPage />
                  </AdminLayout>
                </PrivateRoute>
              }
            />

            {/* Roles */}
            <Route
              path="/admin/roles"
              element={
                <PrivateRoute>
                  <AdminLayout>
                    <RolesListPage />
                  </AdminLayout>
                </PrivateRoute>
              }
            />

            {/* Payments */}
            <Route
              path="/admin/payments"
              element={
                <PrivateRoute>
                  <AdminLayout>
                    <PaymentsPage />
                  </AdminLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/payments/:id"
              element={
                <PrivateRoute>
                  <AdminLayout>
                    <PaymentDetailPage />
                  </AdminLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/refunds"
              element={
                <PrivateRoute>
                  <AdminLayout>
                    <RefundsPage />
                  </AdminLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/refunds/:id"
              element={
                <PrivateRoute>
                  <AdminLayout>
                    <RefundDetailPage />
                  </AdminLayout>
                </PrivateRoute>
              }
            />

            {/* Discounts */}
            <Route
              path="/admin/discounts"
              element={
                <PrivateRoute>
                  <AdminLayout>
                    <DiscountsPage />
                  </AdminLayout>
                </PrivateRoute>
              }
            />

            <Route
              path="/admin/applications/:userId"
              element={
                <PrivateRoute>
                  <AdminLayout>
                    <ApplicationDetail />
                  </AdminLayout>
                </PrivateRoute>
              }
            />

            <Route
              path="/admin/applications"
              element={
                <PrivateRoute>
                  <AdminLayout>
                    <ApplicationsListPage />
                  </AdminLayout>
                </PrivateRoute>
              }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/admin" replace />} />
          </Routes>
        </Router>
        <Toaster position="top-right" richColors />
      </PermissionProvider>
    </div>
  );
}
export default App;
