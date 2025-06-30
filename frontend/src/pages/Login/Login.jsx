import React, { useState } from "react";
import { useApi } from "../../context/ApiContext";
import "./Login.css"; // minimal override
import { FaUserShield, FaUser, FaSignInAlt } from "react-icons/fa";

export default function Login() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const { login } = useApi();
  const [isFlipped, setIsFlipped] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const finalized_formdata = {
        email: formData.email.trim(),
        password: formData.password.trim(),
        isAdmin: isAdmin,
      };
      login(finalized_formdata);
    } catch (err) {
      console.err(err.message)
    } finally {
      setFormData({ email: "", password: "" });
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const toggleRole = () => {
    setIsFlipped(!isFlipped);
    setTimeout(() => setIsAdmin(!isAdmin), 300); // Sync with animation
  };

  return (
    <div className="login-container">
      <div className={`login-card ${isFlipped ? "flipped" : ""}`}>
        {/* Front Side - User Login */}
        <div className="login-card-front">
          <div className="login-header">
            <FaUser size={32} className="user-icon" />
            <h3>User Login</h3>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
              />
              {errors.email && (
                <div className="error-message">{errors.email}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className={`form-control ${
                  errors.password ? "is-invalid" : ""
                }`}
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
              {errors.password && (
                <div className="error-message">{errors.password}</div>
              )}
            </div>

            <button type="submit" className="login-button">
              <FaSignInAlt className="me-2" />
              Login as User
            </button>
          </form>

          <button className="switch-button" onClick={toggleRole}>
            Switch to Admin Login
          </button>
        </div>

        {/* Back Side - Admin Login */}
        <div className="login-card-back">
          <div className="login-header">
            <FaUserShield size={32} className="admin-icon" />
            <h3>Admin Login</h3>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Admin Email</label>
              <input
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
              />
              {errors.email && (
                <div className="error-message">{errors.email}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Admin Password</label>
              <input
                type="password"
                className={`form-control ${
                  errors.password ? "is-invalid" : ""
                }`}
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
              {errors.password && (
                <div className="error-message">{errors.password}</div>
              )}
            </div>

            <button type="submit" className="login-button">
              <FaSignInAlt className="me-2" />
              Login as Admin
            </button>
          </form>

          <button className="switch-button" onClick={toggleRole}>
            Switch to User Login
          </button>
        </div>
      </div>
    </div>
  );
}
