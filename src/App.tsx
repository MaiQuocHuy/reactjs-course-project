import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import LoginForm from "./components/LoginForm";
import { AdminLayout } from "./components/admin/AdminLayout";
import { DashboardPage } from "./pages/admin/DashboardPage";
import { UsersListPage } from "./pages/admin/users";
import { UserDetailPage } from "./pages/admin/users";
import { CategoriesListPage } from "./pages/admin/categories/CategoriesListPage";
import { PaymentsPage } from "./pages/payments";
import RefundsPage from "./pages/refunds";

function App() {
  return (
    <div className="h-screen w-screen m-0 p-0 overflow-hidden">
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
          <Route
            path="/admin/users"
            element={
              <AdminLayout>
                <UsersListPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/users/:id"
            element={
              <AdminLayout>
                <UserDetailPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <AdminLayout>
                <CategoriesListPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/payments"
            element={
              <AdminLayout>
                <PaymentsPage />
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

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/admin" replace />} />
        </Routes>
      </Router>
      <Toaster position="top-right" richColors />
    </div>
  );
}
export default App;
