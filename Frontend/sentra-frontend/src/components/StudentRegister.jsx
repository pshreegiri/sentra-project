import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../pages/StudentRegister.css";

export default function StudentRegister() {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    department: "",
    courseYear: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Validation
  const validate = () => {
    let newErrors = {};

    if (!/^[A-Za-z ]{3,}$/.test(formData.name)) {
      newErrors.name = "Enter a valid full name (min 3 letters)";
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be exactly 10 digits";
    }

    if (!formData.department.trim()) {
      newErrors.department = "Department is required";
    }

    if (!/^[A-Za-z. ]+\/[1-9]$/.test(formData.courseYear)) {
      newErrors.courseYear =
        "Format should be Course/Year (e.g. B.Tech/2)";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      await register({
        ...formData,
        role: "student", // 🔒 role fixed here
      });

      alert("Student registered successfully");
      navigate("/login");
    } catch (error) {
      alert(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>🎓 Student Registration</h2>
        <p className="auth-subtitle">
          Register to report incidents and access safety resources
        </p>

        <div className="input-group">
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <small className="error">{errors.name}</small>}

          <input
            name="email"
            type="email"
            placeholder="College Email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <small className="error">{errors.email}</small>}

          <input
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
          />
          {errors.mobile && <small className="error">{errors.mobile}</small>}

          <input
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
          />
          {errors.department && (
            <small className="error">{errors.department}</small>
          )}

          <input
            name="courseYear"
            placeholder="Course / Year (e.g. B.Tech/2)"
            value={formData.courseYear}
            onChange={handleChange}
          />
          {errors.courseYear && (
            <small className="error">{errors.courseYear}</small>
          )}

          <input
            name="password"
            type="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <small className="error">{errors.password}</small>
          )}
        </div>

        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="auth-footer-text">
          Already registered?{" "}
          <span className="auth-link" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
