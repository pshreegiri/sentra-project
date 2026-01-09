import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../pages/StaffRegister.css";

export default function StaffRegister() {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    department: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    let newErrors = {};

    if (!/^[A-Za-z ]{3,}$/.test(formData.name.trim())) {
      newErrors.name = "Enter a valid full name (at least 3 letters)";
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    if (!/^\d{10}$/.test(formData.mobile.trim())) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }

    if (!formData.department.trim()) {
      newErrors.department = "Department is required";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      await register({
        ...formData,
        role: "staff",
      });

      alert("Staff registered successfully");
      navigate("/login", { replace: true });
    } catch (error) {
      alert(error.message || "Staff registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-box" onSubmit={handleSubmit}>
        <h2>🧑‍🏫 Staff Registration</h2>

        {/* ✅ Subtitle (adds height like student page) */}
        <p className="auth-subtitle">
          Register to manage and review student incidents
        </p>

        {/* ✅ Input group (adds spacing like student page) */}
        <div className="input-group">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <small className="error">{errors.name}</small>}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Official Email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <small className="error">{errors.email}</small>}
          </div>

          <div>
            <input
              type="tel"
              name="mobile"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
            />
            {errors.mobile && <small className="error">{errors.mobile}</small>}
          </div>

          <div>
            <input
              type="text"
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleChange}
            />
            {errors.department && (
              <small className="error">{errors.department}</small>
            )}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Create Password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <small className="error">{errors.password}</small>
            )}
          </div>
        </div>

        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        {/* ✅ Footer (adds bottom height like student page) */}
        <p className="auth-footer-text">
          Already registered?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </form>
    </div>
  );
}
