import React, { useState, useEffect } from "react";
import { useApi } from "../../../context/ApiContext";

export default function EditUser({ userData, closeModal }) {
  const { update_user } = useApi();

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

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      await update_user(userData._id, formData);
      closeModal();
    } catch (err) {
      console.error(err);
    }
    // 👉 Later: axios.post('/api/users', formData);
  };

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phone_number: userData.phone_number || "",
        address: userData.address || "",
        branch: userData.branch || "",
      });
    }
  }, [userData]);

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
