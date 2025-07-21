import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace/>;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Logged in but role doesn't match
    // You can redirect to an unauthorized page or home
    return <Navigate to="/" replace/>;
  }

  return children;
};

export default ProtectedRoute;
