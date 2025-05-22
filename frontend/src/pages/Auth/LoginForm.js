import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LoginForm.css"

const Login = ({ onNavigate }) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Login</h2>
        <form>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" placeholder="Enter email" />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" placeholder="Enter password" />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
          <p className="text-center mt-3">
            Don't have an account? 
            <span className="text-primary ms-2" style={{ cursor: "pointer" }} onClick={() => setShowOptions(true)}>Register</span>
          </p>
        </form>

        {showOptions && (
          <div className="text-center mt-3">
            <p>Register as:</p>
            <button className="btn btn-outline-primary me-2" onClick={() => onNavigate("user")}>User</button>
            <button className="btn btn-outline-danger" onClick={() => onNavigate("admin")}>Admin</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
