import React, { useState } from "react";
import { useApi } from "../../../context/ApiContext";
import './AddUser.css'
export default function AddUser() {
  const { addUser, users, branches } = useApi();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    branch: "",
    phone_number: "",
    address: "",
    copyFromUserId: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addUser(formData);
    console.log("Submitted User:", formData);
    setFormData({
      name: "",
      email: "",
      branch: "",
      phone_number: "",
      address: "",
      copyFromUserId: "",
    });
  };

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.branch.trim() !== "" &&
    formData.phone_number.trim() !== "" &&
    formData.address.trim() !== "";

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Add New User</h2>
      <form onSubmit={handleSubmit}>
        {/* Copy Tasks From User */}
        <div className="mb-3">
          <label className="form-label">Copy Tasks From User</label>
          {users.length === 0 && <p>No users available</p>}
          {users.map((user) => (
            <div className="form-check" key={user._id}>
              <input
                className="form-check-input"
                type="radio"
                name="copyFromUserId"
                id={`copy-user-${user._id}`}
                value={user._id}
                checked={formData.copyFromUserId === user._id}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor={`copy-user-${user._id}`}>
                {user.name} ({user.email})
              </label>
            </div>
          ))}
        </div>

        {/* Name */}
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Branch */}
        <div className="mb-3">
          <label className="form-label">Select Branch</label>
          {branches.map((branch) => (
            <div className="form-check" key={branch._id}>
              <input
                className="form-check-input"
                type="radio"
                name="branch"
                id={`branch-${branch._id}`}
                value={branch._id}
                checked={formData.branch === branch._id}
                onChange={handleChange}
                required
              />
              <label className="form-check-label" htmlFor={`branch-${branch._id}`}>
                {branch.name} ({branch.address})
              </label>
            </div>
          ))}
        </div>

        {/* Phone */}
        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input
            type="tel"
            name="phone_number"
            className="form-control"
            value={formData.phone_number}
            onChange={handleChange}
            pattern="[0-9]{10}"
            title="Enter a 10-digit phone number"
            required
          />
        </div>

        {/* Address */}
        <div className="mb-3">
          <label className="form-label">Address</label>
          <textarea
            name="address"
            className="form-control"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit */}
        <button type="submit" className="btn btn-primary" disabled={!isFormValid}>
          Add User
        </button>
      </form>
    </div>
  );
}
