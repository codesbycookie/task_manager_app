import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Outlet} from 'react-router-dom';
import { useApi } from '../../../context/ApiContext';

const UserNavbar = () => {
  const [dateTime, setDateTime] = useState(new Date());


    const {logout} = useApi();
  

  useEffect(() => {
    const interval = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = dateTime.toLocaleDateString();
  const formattedTime = dateTime.toLocaleTimeString();

  return (
    <>
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <a className="navbar-brand" href="/">User TaskManager</a>

      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <span className="nav-link text-light">
              📅 {formattedDate} | ⏰ {formattedTime}
            </span>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/user/sheets">My Tasks</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/user/change-password">Change Password</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/user/edit-profile">Edit Profile</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/user">Profile</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" onClick={logout}>Logout</a>
          </li>
        </ul>
      </div>
    </nav>
    <Outlet/>
    </>
  );
};

export default UserNavbar;
