import { useAuthStore } from "../store/useAuthStore";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowRoles }) {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/login" replace />;
  if (!allowRoles.includes(user.role))
    return <div className="text-2xl text-red-600">Access Denied</div>;

  return children;
}
