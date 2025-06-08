import React from 'react';
import { useApi } from '../../../context/ApiContext';
import './Profile.css';

export default function UserProfile() {
  const { user } = useApi();

  return (
    <div className="user-profile-container">
      <h2 className="user-profile-heading">User Profile</h2>
      <table className="user-profile-table">
        <tbody>
          <tr><th>Name</th><td>{user.name}</td></tr>
          <tr><th>Email</th><td>{user.email}</td></tr>
          <tr><th>Phone</th><td>{user.phone_number}</td></tr>
          <tr><th>Address</th><td>{user.address}</td></tr>
          <tr><th>Branch ID</th><td>{user.branch}</td></tr>
          <tr><th>UID</th><td>{user.uid}</td></tr>
          <tr><th>Created</th><td>{new Date(user.createdAt).toLocaleString()}</td></tr>
          <tr><th>Updated</th><td>{new Date(user.updatedAt).toLocaleString()}</td></tr>
        </tbody>
      </table>
    </div>
  );
}
