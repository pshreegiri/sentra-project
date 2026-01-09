import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { authUser, loading } = useContext(AuthContext);

  // ⏳ Wait until auth state is ready
  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;
  }

  // ❌ Not logged in
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Role not allowed
  if (role && authUser.role !== role) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Allowed
  return children;
}
