import React from 'react';
import { useApi } from '../../../context/ApiContext';

export default function UserProfile() {

  const {user} = useApi();

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>User Profile</h2>
      <div style={styles.row}><strong>Name:</strong> {user.name}</div>
      <div style={styles.row}><strong>Email:</strong> {user.email}</div>
      <div style={styles.row}><strong>Phone:</strong> {user.phone_number}</div>
      <div style={styles.row}><strong>Address:</strong> {user.address}</div>
      <div style={styles.row}><strong>Branch ID:</strong> {user.branch}</div>
      <div style={styles.row}><strong>UID:</strong> {user.uid}</div>
      <div style={styles.row}><strong>Created:</strong> {new Date(user.createdAt).toLocaleString()}</div>
      <div style={styles.row}><strong>Updated:</strong> {new Date(user.updatedAt).toLocaleString()}</div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '500px',
    margin: 'auto',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
  },
  heading: {
    marginBottom: '20px',
    textAlign: 'center'
  },
  row: {
    marginBottom: '10px'
  }
};
