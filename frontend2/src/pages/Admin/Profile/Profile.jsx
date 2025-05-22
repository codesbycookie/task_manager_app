/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import "bootstrap/dist/css/bootstrap.min.css";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { FaTasks, FaCalendarAlt, FaUser, FaSignOutAlt } from "react-icons/fa";
import { Card, Row, Col, Button, ListGroup } from "react-bootstrap";
import { useApi } from "../../../context/ApiContext";

// Register the necessary chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
const Profile = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
  const [tasksCompleted, setTasksCompleted] = useState(25);
  const [tasksInProgress, setTasksInProgress] = useState(5);
  const [pendingTasks, setPendingTasks] = useState(3);

  const {admin, fetch_users, fetch_notifications} = useApi(); 
  
  useEffect(() => {
    fetch_users();
    fetch_notifications();
  }, []);
  
  const user = {
    name: admin?.name ||"John Doe",
    email: admin?.email || "john.doe@example.com",
    avatar: "data:image/jpeg;base64,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", // Placeholder image URL
  };

  const adminDetails = {
    role: "Admin",
    lastLogin: "2025-04-20 10:30 AM",
  };

  console.log("Admin Details:", admin);
  const taskProgressData = {
    labels: ["Completed", "In Progress", "Pending"],
    datasets: [
      {
        label: "Task Status",
        data: [tasksCompleted, tasksInProgress, pendingTasks],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 1,
      },
    ],
  };

  const taskProgressOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mt-5">
      <Row className="d-flex justify-content-center">
        {/* User Profile Section */}
        <Col md={5} className="text-center">
          <Card className="shadow-sm">
            <Card.Body>
              <img
                src={user.avatar}
                alt="Profile Avatar"
                className="img-fluid rounded-circle mb-3"
                style={{ width: "120px", height: "120px" }}
              />
              <h4>{user.name}</h4>
              <p>{user.email}</p>
              <Button variant="primary">Edit Profile</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Right-side Content (Analytics & Details) */}
        <Col md={5}>
        <Row>
            <Col md={12}>
              <Card className="shadow-sm">
                <Card.Header className="bg-dark text-white">
                  <h5>Current Date and Time</h5>
                </Card.Header>
                <Card.Body>
                  <h4>{currentTime}</h4>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          
        </Col>
      </Row>
      <Row className='d-flex justify-content-center align-items-center mt-4'>
            {/* Task Analytics Chart */}
            <Col md={10} className="mb-4">
              <Card className="shadow-sm">
                <Card.Header className="bg-info text-white">
                  <h5>Task Analytics</h5>
                </Card.Header>
                <Card.Body>
                  <Line data={taskProgressData} options={taskProgressOptions} />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className='d-flex justify-content-center'>
            {/* Recent Activities */}
            <Col md={5} className="mb-4">
              <Card className="shadow-sm">
                <Card.Header className="bg-warning text-white">
                  <h5>Recent Activities</h5>
                </Card.Header>
                <Card.Body>
                  <ListGroup>
                    <ListGroup.Item>Completed Task #25: API for user login</ListGroup.Item>
                    <ListGroup.Item>Started working on feature X</ListGroup.Item>
                    <ListGroup.Item>Attended team meeting</ListGroup.Item>
                    <ListGroup.Item>Updated project board with current progress</ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>

            {/* Admin Details */}
            <Col md={5} className="mb-4 ">
              <Card className="shadow-sm">
                <Card.Header className="bg-success text-white">
                  <h5>Admin Details</h5>
                </Card.Header>
                <Card.Body>
                  <p><strong>Role:</strong> {adminDetails.role}</p>
                  <p><strong>Last Login:</strong> {adminDetails.lastLogin}</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Current Date and Time */}
    </div>
  );
};

export default Profile;
