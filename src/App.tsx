import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginForm from "./components/LoginForm";
import { AdminLayout } from "./components/admin/AdminLayout";
import { UsersListPage } from "./pages/admin/users";
import { UserDetailPage } from "./pages/admin/users";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login route */}
        <Route path="/login" element={<LoginForm />} />

        {/* Admin routes */}
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

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/admin/users" replace />} />
      </Routes>
    </Router>
  );
}
export default App;
