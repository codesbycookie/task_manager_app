import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

export default function StaffPerformance() {
  // Dummy data for performance bar chart
  const barData = {
    labels: ['John', 'Sarah', 'Michael', 'Emily', 'David'],
    datasets: [
      {
        label: 'Tasks Completed',
        data: [35, 42, 28, 50, 39],
        backgroundColor: '#4CAF50',
        borderRadius: 8
      }
    ]
  };

  // Dummy data for department breakdown
  const pieData = {
    labels: ['Engineering', 'Marketing', 'HR', 'Sales', 'Support'],
    datasets: [
      {
        label: 'Task Distribution',
        data: [120, 90, 45, 75, 60],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#66BB6A', '#BA68C8']
      }
    ]
  };

  // Dummy top performers list
  const topPerformers = ['Emily', 'Sarah', 'David', 'John', 'Michael'];

  return (
    <div style={{ padding: '2rem', fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f5f8fc', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>📈 Staff Performance Overview</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
        {/* Bar Chart */}
        <div style={cardStyle}>
          <h3 style={cardTitle}>Tasks Completed by Staff</h3>
          <Bar data={barData} />
        </div>

        {/* Top Performers */}
        <div style={cardStyle}>
          <h3 style={cardTitle}>🏆 Top Performers</h3>
          <ol style={{ paddingLeft: '1.2rem', marginTop: '1rem', color: '#333' }}>
            {topPerformers.map((name, index) => (
              <li key={index} style={{ marginBottom: '0.6rem' }}>{name}</li>
            ))}
          </ol>
        </div>
      </div>

      {/* Department Task Breakdown */}
      <div style={cardStyle}>
        <h3 style={cardTitle}>📊 Task Distribution by Department</h3>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <Doughnut data={pieData} />
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  backgroundColor: '#fff',
  padding: '1.5rem',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
};

const cardTitle = {
  marginBottom: '1.2rem',
  borderBottom: '2px solid #eee',
  paddingBottom: '0.5rem',
  color: '#333'
};
