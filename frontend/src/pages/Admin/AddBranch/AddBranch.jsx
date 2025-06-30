import React, { useState } from 'react';
import { useApi } from '../../../context/ApiContext';
export default function AddBranch() {

    const {createBranch} = useApi();


  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async(e) => {
    e.preventDefault();

    const newBranch = {
      name,
      address,
      phone_number: phone,
    };

    createBranch(newBranch)
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Add New Branch</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Branch Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Address</label>
          <input
            type="text"
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input
            type="text"
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        

        <button type="submit" className="btn btn-primary">Create Branch</button>
      </form>
    </div>
  );
}
