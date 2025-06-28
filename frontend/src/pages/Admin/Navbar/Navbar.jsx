import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useApi } from "../../../context/ApiContext";
import { FaUsers, FaBuilding, FaUserPlus, FaTasks, FaSignOutAlt, FaClock, FaCalendarAlt } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import "./Navbar.css";

const AdminNavbar = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { logout } = useApi();

  useEffect(() => {
    const interval = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = dateTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
  
  const formattedTime = dateTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark px-3 py-2 shadow-sm" style={{ backgroundColor: "#8dc540" }}>
        <div className="container-fluid">
          <a className="navbar-brand fw-bold d-flex align-items-center" href="/">
            <span className="d-none d-sm-inline">Admin Checklist</span>
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-lg-center">
              <li className="nav-item d-flex align-items-center px-3">
                <span className="nav-link text-white d-flex align-items-center">
                  <FaCalendarAlt className="me-4" />
                  <span className="d-none d-md-inline text-white">{formattedDate}</span>
                </span>
                <span className="nav-link text-muted d-flex align-items-center text-white">
                  <FaClock className="me-2 text-white" />
                  <span className="text-white">{formattedTime}</span>
                </span>
              </li>
              
              <li className="nav-item">
                <a className="nav-link d-flex align-items-center" href="/admin/">
                  <FaUsers className="me-2" />
                  <span>Profile</span>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link d-flex align-items-center" href="/admin/users">
                  <FaUsers className="me-2" />
                  <span>Users</span>
                </a>
              </li>
              
              <li className="nav-item">
                <a className="nav-link d-flex align-items-center" href="/admin/branches">
                  <FaBuilding className="me-2" />
                  <span>Branches</span>
                </a>
              </li>
              
              <li className="nav-item">
                <a className="nav-link d-flex align-items-center" href="/admin/add-user">
                  <FaUserPlus className="me-2" />
                  <span>Add User</span>
                </a>
              </li>
              
              <li className="nav-item">
                <a className="nav-link d-flex align-items-center" href="/admin/add-task">
                  <FaTasks className="me-2" />
                  <span>Add Task</span>
                </a>
              </li>
              
              <li className="nav-item">
                <button 
                  className="btn btn-danger bg-danger align-items-center" 
                  onClick={handleLogoutClick}
                >
                  <FaSignOutAlt className="me-2" />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4">
          <div className="text-center mb-3">
            <div className="bg-warning bg-opacity-10 d-inline-flex p-3 rounded-circle mb-3">
              <FaSignOutAlt size={32} className="text-warning" />
            </div>
            <p>
              Are you sure you want to logout from <strong>TaskManager Admin</strong>?
            </p>
            <p className="text-muted small">
              You'll need to login again to access the admin panel.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button 
            variant="outline-secondary text-light" 
            onClick={() => setShowLogoutModal(false)}
            className="px-4"
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={confirmLogout}
            className="px-4 d-flex align-items-center bg-danger"
          >
            <FaSignOutAlt className="me-2" />
            Logout
          </Button>
        </Modal.Footer>
      </Modal>

      <Outlet />
    </>
  );
};

export default AdminNavbar;