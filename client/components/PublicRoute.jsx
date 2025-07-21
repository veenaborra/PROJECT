import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { user } = useAuth();

  if (user) {
    // If logged in, redirect to dashboard based on role
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace/>;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
