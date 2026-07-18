import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAdminAuthenticated, loading } = useAuth();

  if (loading) {
    // Premium Spinner added here!
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBFBFB] dark:bg-black transition-colors duration-500">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-black dark:border-white border-b-transparent"></div>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

export default ProtectedRoute;
