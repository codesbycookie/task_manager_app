import React, { useState, useEffect } from 'react';
import { useApi } from '../../../context/ApiContext';

export default function EditProfile() {

    const {user} = useApi();



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
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>Edit Profile</h2>

      <label style={styles.label}>Name</label>
      <input type="text" name="name" value={formData.name} onChange={handleChange} style={styles.input} />

      <label style={styles.label}>Email</label>
      <input type="email" name="email" disabled='true' value={formData.email} onChange={handleChange} style={styles.input} />

      <label style={styles.label}>Phone Number</label>
      <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} style={styles.input} />

      <label style={styles.label}>Address</label>
      <textarea name="address" value={formData.address} onChange={handleChange} style={styles.input} />

      

      <button type="submit" style={styles.button}>Save Changes</button>
    </form>
  );
}

const styles = {
  form: {
    padding: '20px',
    maxWidth: '500px',
    margin: 'auto',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  label: {
    display: 'block',
    marginTop: '10px',
    fontWeight: 'bold'
  },
  input: {
    width: '100%',
    padding: '8px',
    marginTop: '5px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc'
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};
