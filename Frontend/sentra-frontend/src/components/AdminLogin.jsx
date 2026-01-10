import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AdminAuthContext } from "../context/AdminAuthContext";
import "../pages/AdminLogin.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useContext(AdminAuthContext);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/login",
        { email, password }
      );

      login(response.data.token, response.data.user);
      navigate("/admin");
      
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-info">
          <h1>Sentra System</h1>
          <p>
            Secure incident reporting and safety management platform for educational institutions.
          </p>
          <ul>
            <li>✔ Secure login access</li>
            <li>✔ Role-based dashboards</li>
            <li>✔ Fast incident tracking</li>
          </ul>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <h2>🔐 Admin Login</h2>
          <p className="auth-subtitle">Enter your admin credentials</p>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}