import React, { useState } from "react";
import { useApi } from "../../../context/ApiContext";

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
  };



  return (
    <div className="container mt-5">
      <h2 className="mb-4">Add New User</h2>
      <form onSubmit={handleSubmit}>

        {/* Copy Tasks From User - New field */}
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
              <label
                className="form-check-label"
                htmlFor={`copy-user-${user._id}`}
              >
                {user.name} ({user.email})
              </label>
            </div>
          ))}
        </div>

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
              <label
                className="form-check-label"
                htmlFor={`branch-${branch._id}`}
              >
                {branch.name} ({branch.address})
              </label>
            </div>
          ))}
        </div>

        <div className="mb-3">
          <label className="form-label">Phone Number</label>
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
          <label className="form-label">Address</label>
          <textarea
            name="address"
            className="form-control"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Add User
        </button>
      </form>
    </div>
  );
}
