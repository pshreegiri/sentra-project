import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/AdminLogin.css"; // keep your CSS

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Only allow the default admin credentials
    if (email === "admin@sentra.com" && password === "admin123") {
      setError("");
      navigate("/admin"); // redirect to admin dashboard
    } else {
      setError("Invalid email or password"); // block everything else
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* LEFT INFO PANEL */}
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

        {/* LOGIN FORM */}
        <form className="login-form" onSubmit={handleLogin}>
          <h2>🔐 Admin Login</h2>
          <p className="auth-subtitle">Enter your admin credentials</p>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error">{error}</p>}

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
