import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAdminAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // ya koi spinner/loader component
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

export default ProtectedRoute;