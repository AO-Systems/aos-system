
import { ReactNode } from "react";
import { Header } from "./Header";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

interface DashboardLayoutProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export const DashboardLayout = ({ 
  children,
  requireAdmin = false 
}: DashboardLayoutProps) => {
  const { user, isAuthenticated } = useAuth();
  
  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }
  
  // If admin access is required but user is not an admin, redirect
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="bg-gray-50 border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Ember Record Keeper
        </div>
      </footer>
    </div>
  );
};
