import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Admin Dashboard</h2>
      <p>Welcome, {user.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
