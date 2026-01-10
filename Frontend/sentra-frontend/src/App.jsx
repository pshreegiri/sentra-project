import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useContext } from "react";

import Home from "./components/Home";
import Login from "./components/Login";
import StudentRegister from "./components/StudentRegister";
import StaffRegister from "./components/StaffRegister";
import StudentDashboard from "./components/StudentDashboard";
import StaffDashboard from "./components/StaffDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import NotFound from "./components/NotFound";
import AwarenessHub from "./components/AwarenessHub";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

import { AuthContext } from "./context/AuthContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";

function App() {
  const { loading } = useContext(AuthContext);

  // ⏳ Wait until auth state is loaded
  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;
  }

  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/student" element={<StudentRegister />} />
          <Route path="/register/staff" element={<StaffRegister />} />
          <Route path="/aware" element={<AwarenessHub />} />
          
          {/* Admin Login - Public */}
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Protected Student/Staff routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/staff"
            element={
              <ProtectedRoute role="staff">
                <StaffDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin route */}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AdminAuthProvider>
  );
}

export default App;