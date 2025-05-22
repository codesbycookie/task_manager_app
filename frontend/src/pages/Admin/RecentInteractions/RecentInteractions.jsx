import React from 'react';

export default function RecentInteractions() {
  const comments = [
    "Great job on the latest update!",
    "Need clarification on the new policy.",
    "Can we reschedule tomorrow’s meeting?",
    "Reviewed the new task list.",
    "Approved the IT report.",
  ];

  const tasks = [
    "Prepare April Sales Report",
    "Fix login authentication issue",
    "Organize team building event",
    "Update client feedback data",
    "Review marketing strategy deck",
  ];

  const logins = [
    "John Doe logged in at 9:15 AM",
    "Sarah Lee logged in at 8:45 AM",
    "Admin logged in at 10:03 AM",
  ];

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f7f9fb', minHeight: '100vh' }}>
      <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Recent Interactions</h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem'
      }}>
        {/* Comments */}
        <div style={cardStyle}>
          <h3 style={titleStyle}>💬 Latest Comments</h3>
          <ul style={{ paddingLeft: '1rem' }}>
            {comments.map((comment, index) => (
              <li key={index} style={{ marginBottom: '0.8rem', color: '#333' }}>
                {comment}
              </li>
            ))}
          </ul>
        </div>

        {/* Tasks */}
        <div style={cardStyle}>
          <h3 style={titleStyle}>📝 Recent Tasks</h3>
          <ul style={{ paddingLeft: '1rem' }}>
            {tasks.map((task, index) => (
              <li key={index} style={{ marginBottom: '0.8rem', color: '#333' }}>
                {task}
              </li>
            ))}
          </ul>
        </div>

        {/* Logins */}
        <div style={cardStyle}>
          <h3 style={titleStyle}>🔐 Login Activity</h3>
          <ul style={{ paddingLeft: '1rem' }}>
            {logins.map((entry, index) => (
              <li key={index} style={{ marginBottom: '0.8rem', color: '#333' }}>
                {entry}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  backgroundColor: '#fff',
  padding: '1.5rem',
  borderRadius: '10px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
};

const titleStyle = {
  marginBottom: '1rem',
  borderBottom: '2px solid #eee',
  paddingBottom: '0.5rem',
  color: '#444'
};
