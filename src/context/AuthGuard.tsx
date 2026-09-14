import { Navigate } from "react-router-dom";
import { useAuthContext } from "./AuthContext";

export default function AuthGuard() {
  const { user } = useAuthContext();

  if (!user) {
    return <Navigate to="/login" />;
  }
}
