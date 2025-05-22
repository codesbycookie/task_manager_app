import React, { useState } from "react";
import { useApi } from "../../../context/ApiContext";

export default function AddUser() {

  const {add_user} = useApi();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    address: "",
    branch: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    add_user(formData)
    // 👉 Later: axios.post('/api/users', formData);
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">➕ Add New User</h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">👤 Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">📧 Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* <div className="mb-3">
          <label className="form-label">🆔 UID</label>
          <input
            type="text"
            name="uid"
            className="form-control"
            value={formData.uid}
            onChange={handleChange}
            required
          />
        </div> */}

        <div className="mb-3">
          <label className="form-label">📱 Phone Number</label>
          <input
            type="tel"
            name="phone_number"
            className="form-control"
            value={formData.phone_number}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">🏠 Address</label>
          <input
            type="text"
            name="address"
            className="form-control"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">🏢 Branch</label>
          <input
            type="text"
            name="branch"
            className="form-control"
            value={formData.branch}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}
