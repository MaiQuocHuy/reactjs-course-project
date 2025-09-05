import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginForm from "./components/LoginForm";
import { AdminLayout } from "./components/admin/AdminLayout";
import { DashboardPage } from "./pages/admin/DashboardPage";
import { UsersListPage } from "./pages/admin/users";
import { UserDetailPage } from "./pages/admin/users";
import { PaymentsPage } from "./pages/payments";
import { PaymentDetailPage } from "./pages/payments/PaymentDetailPage";
import RefundsPage from "./pages/refunds";
import { ApplicationDetail } from "./components/ApplicationDetail/ApplicationDetail";
import { ApplicationsListPage } from "./pages/ApplicationList";
import RevenuesPage from "./pages/revenues/RevenuesPage";
import CoursesPage from "./pages/courses/CoursesPage";
import CourseDetailPage from "./pages/courses/course-detail/CourseDetailPage";
import CourseReviewDetailPage from "./pages/courses/course-detail/CourseReviewDetailPage";
import { Toaster } from "@/components/ui/sonner";
import { RefundDetailPage } from "./pages/refunds/RefundDetailPage";
import { CategoriesListPage } from "./pages/admin/categories/CategoriesListPage";
import { RolesListPage } from "./pages/admin/roles";
import { PermissionProvider } from "@/components/providers/PermissionProvider";
import PermissionDemoPage from "./pages/admin/PermissionDemoPage";
import AdminPermissionDemoPage from "./pages/admin/AdminPermissionDemoPage";
import { AssignRoleToUsersPage } from "./pages/admin/users/AssignRoleToUsersPage";

function App() {
  return (
    <div className="h-screen w-screen m-0 p-0 overflow-hidden">
      <PermissionProvider>
        <Router>
          <Routes>
            {/* Login route */}
            <Route path="/login" element={<LoginForm />} />

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <AdminLayout>
                  <DashboardPage />
                </AdminLayout>
              }
            />

            {/* Permission Demo */}
            <Route
              path="/admin/permissions-demo"
              element={
                <AdminLayout>
                  <PermissionDemoPage />
                </AdminLayout>
              }
            />

            {/* Real Admin Permission Demo */}
            <Route
              path="/admin/permission-system-demo"
              element={
                <AdminLayout>
                  <AdminPermissionDemoPage />
                </AdminLayout>
              }
            />

            {/* Users */}
            <Route
              path="/admin/users"
              element={
                <AdminLayout>
                  <UsersListPage />
                </AdminLayout>
              }
            />
            {/* User Detail */}
            <Route
              path="/admin/users/:id"
              element={
                <AdminLayout>
                  <UserDetailPage />
                </AdminLayout>
              }
            />

            {/* Assign Roles to Users */}
            <Route
              path="/admin/assign-roles"
              element={
                <AdminLayout>
                  <AssignRoleToUsersPage />
                </AdminLayout>
              }
            />

            {/* Courses */}
            <Route
              path="/admin/courses"
              element={
                <AdminLayout>
                  <CoursesPage />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/pending-courses"
              element={
                <AdminLayout>
                  <CoursesPage />
                </AdminLayout>
              }
            />
            {/* Course Detail */}
            <Route
              path="/admin/courses/:id"
              element={
                <AdminLayout>
                  <CourseDetailPage />
                </AdminLayout>
              }
            />
            {/* Course Review Detail */}
            <Route
              path="/admin/courses/review-course/:id"
              element={
                <AdminLayout>
                  <CourseReviewDetailPage />
                </AdminLayout>
              }
            />

            {/* Revenues */}
            <Route
              path="/admin/revenues"
              element={
                <AdminLayout>
                  <RevenuesPage />
                </AdminLayout>
              }
            />

            {/* Categories */}
            <Route
              path="/admin/categories"
              element={
                <AdminLayout>
                  <CategoriesListPage />
                </AdminLayout>
              }
            />

            {/* Roles */}
            <Route
              path="/admin/roles"
              element={
                <AdminLayout>
                  <RolesListPage />
                </AdminLayout>
              }
            />

            {/* Payments */}
            <Route
              path="/admin/payments"
              element={
                <AdminLayout>
                  <PaymentsPage />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/payments/:id"
              element={
                <AdminLayout>
                  <PaymentDetailPage />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/refunds"
              element={
                <AdminLayout>
                  <RefundsPage />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/refunds/:id"
              element={
                <AdminLayout>
                  <RefundDetailPage />
                </AdminLayout>
              }
            />

            <Route
              path="/admin/applications/:id"
              element={
                <AdminLayout>
                  <ApplicationDetail />
                </AdminLayout>
              }
            />

            <Route
              path="/admin/applications"
              element={
                <AdminLayout>
                  <ApplicationsListPage />
                </AdminLayout>
              }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
        <Toaster position="top-right" richColors />
      </PermissionProvider>
    </div>
  );
}
export default App;
