import React, { useState } from "react";
import { useApi } from "../../context/ApiContext";

export default function Login() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login } = useApi();

  const handleLogin = (e) => {
    e.preventDefault();
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
      setFormData({
        email: "",
        password: "",
      });
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card p-4 shadow-sm"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h3 className="text-center mb-4">Login</h3>

        {/* Admin/User Toggle */}
        <div className="form-check form-switch mb-4 text-center">
          <input
            className="form-check-input"
            type="checkbox"
            id="roleSwitch"
            checked={isAdmin}
            onChange={() => setIsAdmin(!isAdmin)}
          />
          <label className="form-check-label ms-2" htmlFor="roleSwitch">
            {isAdmin ? "Logging in as Admin" : "Logging in as User"}
          </label>
        </div>
        <form onSubmit={(e) => handleLogin(e)}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              onChange={(e) => handleChange(e)}
              value={formData.email}
              placeholder="name@example.com"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              onChange={(e) => handleChange(e)}
              value={formData.password}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}