import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Root from "../Root";

export default function AuthenticatedLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Root />;
}
