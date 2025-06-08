import React, { useState } from "react";
import { useApi } from "../../context/ApiContext";
import "./Login.css"; // minimal override

export default function Login() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const { login } = useApi();

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
      console.log(err);
    } finally {
      setFormData({ email: "", password: "" });
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100 login-bg">
      <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-center mb-4">Login</h3>

        <div className="form-check form-switch d-flex justify-content-center mb-3">
          <input
            className="form-check-input custom-switch"
            type="checkbox"
            id="roleSwitch"
            checked={isAdmin}
            onChange={() => setIsAdmin(!isAdmin)}
          />
          <label className="form-check-label ms-2" htmlFor="roleSwitch">
            {isAdmin ? "Logging in as Admin" : "Logging in as User"}
          </label>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
            />
            {errors.email && <div className="text-danger small">{errors.email}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
            {errors.password && <div className="text-danger small">{errors.password}</div>}
          </div>

          <button type="submit" className="btn login-btn w-100 mt-3">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
