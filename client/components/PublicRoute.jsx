import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { id, role, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (id) {
   
    if (role === "admin") {
      return <Navigate to="/admin/dashboard" replace/>;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
