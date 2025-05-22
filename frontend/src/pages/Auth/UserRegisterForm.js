import "bootstrap/dist/css/bootstrap.min.css";
import "./UserRegisterForm.css"

const UserRegister = ({ onNavigate }) => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">User Registration</h2>
        <form>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" placeholder="Enter email" />
          </div>
          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input type="text" className="form-control" placeholder="Enter phone number" />
          </div>
          <div className="mb-3">
            <label className="form-label">Branch</label>
            <select className="form-control">
              <option>Branch 1</option>
              <option>Branch 2</option>
              <option>Branch 3</option>
              <option>Branch 4</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">User Address</label>
            <textarea className="form-control" rows="3" placeholder="Enter user address"></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" placeholder="Enter password" />
          </div>
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input type="password" className="form-control" placeholder="Confirm password" />
          </div>
          <button type="submit" className="btn btn-success w-100">Register</button>
          <p className="text-center mt-3">
            Already have an account? <span className="text-primary" style={{ cursor: "pointer" }} onClick={() => onNavigate("login")}>Login</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default UserRegister;
