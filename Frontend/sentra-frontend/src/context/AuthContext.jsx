import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD USER + TOKEN
  // =========================
  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setAuthUser(JSON.parse(storedUser));
      setToken(storedToken);
    }

    setLoading(false);
  }, []);

  // =========================
  // REGISTER
  // =========================
  const register = async (userData) => {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return data;
  };

  // =========================
  // LOGIN (JWT)
  // =========================
  const login = async ({ email, password }) => {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return null;
    }

    // 🔐 SAVE USER + TOKEN
    setAuthUser(data.user);
    setToken(data.token);

    localStorage.setItem("authUser", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);

    return data.user;
  };

  // =========================
  // AUTH HEADER HELPER ✅
  // =========================
  const getAuthHeader = () => {
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    setAuthUser(null);
    setToken(null);
    localStorage.removeItem("authUser");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        token,
        register,
        login,
        logout,
        getAuthHeader, // 👈 IMPORTANT
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
