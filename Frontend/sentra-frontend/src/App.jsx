import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useContext } from "react";

import Home from "./components/Home";
import Login from "./components/Login";
import StudentRegister from "./components/StudentRegister";
import StaffRegister from "./components/StaffRegister";
import StudentDashboard from "./components/StudentDashboard";
import StaffDashboard from "./components/StaffDashboard";
import AdminDashboard from "./components/AdminDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import NotFound from "./components/NotFound";
import AwarenessHub from "./components/AwarenessHub";

import { AuthContext } from "./context/AuthContext";

function App() {
  const { loading } = useContext(AuthContext);

  // ⏳ Wait until auth state is loaded
  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/student" element={<StudentRegister />} />
        <Route path="/register/staff" element={<StaffRegister />} />
        <Route path="/aware" element={<AwarenessHub />} />


        {/* Protected routes */}
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

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
