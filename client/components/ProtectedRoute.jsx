import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { id, role, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  if (!id) {
    // Not logged in, redirect to login and remember where we came from
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (requiredRole && role !== requiredRole) {
    // Logged in but role doesn't match
    return <Navigate to="/" replace/>;
  }

  return children;
};

export default ProtectedRoute;
