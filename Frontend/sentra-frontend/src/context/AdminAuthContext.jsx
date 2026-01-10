import { createContext, useState } from "react";

export const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [adminToken, setAdminToken] = useState(
    localStorage.getItem("adminToken") || null
  );
  const [adminUser, setAdminUser] = useState(
    JSON.parse(localStorage.getItem("adminUser") || "null")
  );

  const login = (token, user) => {
    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminUser", JSON.stringify(user));
    setAdminToken(token);
    setAdminUser(user);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setAdminToken(null);
    setAdminUser(null);
    // Note: Navigation is handled in the component itself
  };

  return (
    <AdminAuthContext.Provider value={{ adminToken, adminUser, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}