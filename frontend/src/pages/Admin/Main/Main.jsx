import React, { useEffect, useState } from "react";

export default function Main() {
    const admin = {
        name: "John Doe",
        email: "admin.test@example.com",
        uid: "UID123456",
        phone_number: "1234567890",
        address: "123 Main Street, Cityville",
        branch: "Engineering"
    };

    const stats = {
        totalStaff: 25,
        totalBranches: 5,
        tasksAssigned: 42,
        tasksCompleted: 35
    };

    const activities = [
        "Assigned task to Marketing Team",
        "Updated branch details",
        "Added new staff member",
        "Completed quarterly report",
        "Reviewed IT department progress"
    ];

    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formattedDate = currentDateTime.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const formattedTime = currentDateTime.toLocaleTimeString('en-US');

    const getGreeting = () => {
        const hour = currentDateTime.getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <div style={{
            padding: "2rem",
            fontFamily: "Segoe UI, sans-serif",
            backgroundColor: "#eef1f5",
            minHeight: "100vh",
            boxSizing: "border-box"
        }}>
            {/* Header */}
            <header style={{ marginBottom: "2rem", textAlign: "center" }}>
                <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>Admin Dashboard</h1>
                <p style={{ fontSize: "1.2rem", color: "#666" }}>
                    {formattedDate} | {formattedTime}
                </p>
                <h2 style={{ marginTop: "1rem", color: "#444" }}>
                    {getGreeting()}, {admin.name}! 👋
                </h2>
            </header>

            {/* Main Grid Layout */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "2rem"
            }}>
                {/* Admin Info Card */}
                <div style={cardStyle}>
                    <h3 style={cardTitleStyle}>Admin Info 👤</h3>
                    <p><strong>Name:</strong> {admin.name}</p>
                    <p><strong>Email:</strong> {admin.email}</p>
                    <p><strong>UID:</strong> {admin.uid}</p>
                    <p><strong>Phone:</strong> {admin.phone_number}</p>
                    <p><strong>Address:</strong> {admin.address}</p>
                    <p><strong>Branch:</strong> {admin.branch}</p>
                </div>

                {/* Stats Card */}
                <div style={cardStyle}>
                    <h3 style={cardTitleStyle}>This Month's Stats 📊</h3>
                    <p><strong>Staff Members:</strong> {stats.totalStaff}</p>
                    <p><strong>Branches:</strong> {stats.totalBranches}</p>
                    <p><strong>Tasks Assigned:</strong> {stats.tasksAssigned}</p>
                    <p><strong>Tasks Completed:</strong> {stats.tasksCompleted}</p>
                </div>

                {/* Recent Activity */}
                <div style={cardStyle}>
                    <h3 style={cardTitleStyle}>Recent Activity 📝</h3>
                    <ul style={{ paddingLeft: "1rem" }}>
                        {activities.map((activity, index) => (
                            <li key={index} style={{ marginBottom: "0.5rem" }}>{activity}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

// 🔧 Reusable Card Styles
const cardStyle = {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "1.5rem",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease-in-out"
};

const cardTitleStyle = {
    marginBottom: "1rem",
    borderBottom: "2px solid #eee",
    paddingBottom: "0.5rem",
    color: "#333"
};
