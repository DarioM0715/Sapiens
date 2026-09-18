import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "./AuthContext";

export default function AuthGuard() {
  const { user,  isLoadingAuth } = useAuthContext();

  if (isLoadingAuth) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
