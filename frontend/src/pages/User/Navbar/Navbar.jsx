import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useApi } from "../../../context/ApiContext";
import { FaTasks, FaKey, FaUserEdit, FaUser, FaSignOutAlt, FaCalendarAlt, FaClock } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import "./Navbar.css";

const UserNavbar = () => {
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
      <nav className="navbar navbar-expand-lg navbar-dark px-3 py-2 shadow-sm" style={{ backgroundColor: '#8dc540' }}>
        <div className="container-fluid">
          <a className="navbar-brand fw-bold d-flex align-items-center" href="/">
            {/* <span className="bg-white text-primary rounded px-2 py-1 me-2">TM</span> */}
            <span className="d-none d-sm-inline">SAP Checklist</span>
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
              <li className="nav-item d-flex align-items-center px-2">
                <span className="nav-link text-white d-flex align-items-center">
                  <FaCalendarAlt className="me-2" />
                  <span className="d-none d-md-inline">{formattedDate}</span>
                </span>
                <span className="nav-link text-white d-flex align-items-center">
                  <FaClock className="me-2" />
                  <span>{formattedTime}</span>
                </span>
              </li>

              <li className="nav-item">
                <a className="nav-link text-white d-flex align-items-center" href="/user">
                  <FaUser className="me-2" />
                  <span>Profile</span>
                </a>
              </li>
              
              <li className="nav-item">
                <a className="nav-link text-white d-flex align-items-center" href="/user/sheets">
                  <FaTasks className="me-2" />
                  <span>My Tasks</span>
                </a>
              </li>
              
              <li className="nav-item">
                <a className="nav-link text-white d-flex align-items-center" href="/user/change-password">
                  <FaKey className="me-2" />
                  <span>Change Password</span>
                </a>
              </li>
              
              <li className="nav-item">
                <a className="nav-link text-white d-flex align-items-center" href="/user/edit-profile">
                  <FaUserEdit className="me-2" />
                  <span>Edit Profile</span>
                </a>
              </li>
              
              
              
              <li className="nav-item">
                <button 
                  className="nav-link text-white bg-danger border-0 d-flex align-items-center" 
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
              Are you sure you want to logout from <strong>TaskManager</strong>?
            </p>
            <p className="text-muted small">
              You'll need to login again to access your account.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button 
            variant="outline-secondary text-white" 
            onClick={() => setShowLogoutModal(false)}
            className="px-4"
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={confirmLogout}
            className="px-4 d-flex align-items-center bg-danger text-white"
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

export default UserNavbar;