import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useApi } from "../../../context/ApiContext";
import "./Navbar.css";

const AdminNavbar = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const { logout } = useApi();

  useEffect(() => {
    const interval = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = dateTime.toLocaleDateString();
  const formattedTime = dateTime.toLocaleTimeString();

  return (
    <>
      <nav className="navbar navbar-expand-lg custom-navbar px-4">
        <a className="navbar-brand fw-bold" href="/">
          Admin TaskManager
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto gap-2">
            <li className="nav-item">
              <span className="nav-link datetime">
                📅 {formattedDate} | ⏰ {formattedTime}
              </span>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/admin/users">
                Users
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/admin/branches">
                Branches
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/admin/add-user">
                Add User
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/admin/add-task">
                Add Task
              </a>
            </li>
            <li className="nav-item">
              <span className="nav-link logout" onClick={logout}>
                Logout
              </span>
            </li>
          </ul>
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default AdminNavbar;
