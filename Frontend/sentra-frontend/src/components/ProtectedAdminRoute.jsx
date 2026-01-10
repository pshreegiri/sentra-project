import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AdminAuthContext } from "../context/AdminAuthContext";

export default function ProtectedAdminRoute({ children }) {
  const { adminToken } = useContext(AdminAuthContext);

  if (!adminToken) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}