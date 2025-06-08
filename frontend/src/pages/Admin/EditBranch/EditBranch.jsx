import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApi } from '../../../context/ApiContext';
import './EditBranch.css'
export default function EditBranch() {
  const { state } = useLocation();
  const {editBranch} = useApi();
  const branch = state?.branch;

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone_number: '',
  });

  useEffect(() => {
    if (branch) {
      setFormData({
        name: branch.name || '',
        address: branch.address || '',
        phone_number: branch.phone_number || '',
      });
    }
  }, [branch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    editBranch(branch._id, formData)
  };

  if (!branch) return <div className="container mt-5">No branch data provided.</div>;

  return (
    <div className="container mt-5">
      <h2>Edit Branch - {branch.name}</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Branch Name</label>
          <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Address</label>
          <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input type="text" className="form-control" name="phone_number" value={formData.phone_number} onChange={handleChange} required />
        </div>
        
        <button type="submit" className="btn btn-primary">Update Branch</button>
      </form>
    </div>
  );
}
