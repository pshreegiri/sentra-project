import { useState } from "react";
import "../index.css";

export default function Register() {
  const [role, setRole] = useState("student");

  return (
    <div className="auth-container">
      <form className="auth-box">
        <h2>Register</h2>

        <input type="text" placeholder="Full Name" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="staff">Staff</option>
        </select>

        <button type="submit">Register</button>

        <p className="auth-text">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
}
