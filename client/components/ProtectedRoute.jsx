import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { id, role, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!id) {
    // Not logged in
    return <Navigate to="/login" replace/>;
  }

  if (requiredRole && role !== requiredRole) {
    // Logged in but role doesn't match
    return <Navigate to="/" replace/>;
  }

  return children;
};

export default ProtectedRoute;
