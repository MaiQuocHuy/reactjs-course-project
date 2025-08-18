import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Sybau Education Admin
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <Button>
                  <Link to="/admin/users">Users</Link>
                </Button>
                <Button>
                  <Link to="/admin/payments">Payments</Link>
                </Button>
                <Button>
                  <Link to="/admin/refunds">Refunds</Link>
                </Button>
              </div>
              <span className="text-sm text-gray-700">Admin User</span>
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">{children}</div>
      </main>
    </div>
  );
};
