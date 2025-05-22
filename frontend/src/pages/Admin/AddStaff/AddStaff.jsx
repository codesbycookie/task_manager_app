import React from 'react';

export default function AddStaff() {
  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem' }}>
      <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Add New Staff Member</h2>

      <form style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          style={inputStyle}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          style={inputStyle}
        />
        <input
          type="text"
          name="uid"
          placeholder="User ID (UID)"
          style={inputStyle}
        />
        <input
          type="number"
          name="phone_number"
          placeholder="Phone Number"
          style={inputStyle}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          style={inputStyle}
        />
        <input
          type="text"
          name="branch"
          placeholder="Branch"
          style={inputStyle}
        />

        <button
          type="submit"
          style={{
            backgroundColor: '#4CAF50',
            color: '#fff',
            padding: '0.9rem',
            fontSize: '1rem',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          Add Staff
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  padding: '0.8rem',
  fontSize: '1rem',
  border: '1px solid #ccc',
  borderRadius: '5px'
};
