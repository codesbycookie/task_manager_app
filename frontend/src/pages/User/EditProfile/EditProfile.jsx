import React, { useState, useEffect } from 'react';
import { useApi } from '../../../context/ApiContext';
import './EditProfile.css'; // 👈 Importing external CSS

export default function EditProfile() {
  const { user, editUser } = useApi();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    address: '',
    branch: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        address: user.address || '',
        branch: user.branch || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editUser(user._id, formData)
    // TODO: submit form data
  };

  return (
    <div className="edit-profile-container">
      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <h2 className="edit-profile-title">Edit Profile</h2>

        <label>Name</label>
        <input type="text" name="name" required value={formData.name} onChange={handleChange} />

        <label>Email</label>
        <input type="email" name="email" required value={formData.email} disabled className="disabled-input" />

        <label>Phone Number</label>
        <input type="text" name="phone_number" required value={formData.phone_number} maxLength={10} onChange={handleChange} />

        <label>Address</label>
        <textarea name="address" required value={formData.address} onChange={handleChange}></textarea>

        <label>Branch Id</label>
        <input type="text" name="branch" required value={formData.branch} disabled onChange={handleChange} />

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
