import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute() {
  const token = useSelector((state) => state.auth.token);
  const location = useLocation();
  return token ? <Outlet /> : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}
