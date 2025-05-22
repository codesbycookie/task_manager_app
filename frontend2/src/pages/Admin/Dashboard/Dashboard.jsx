import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useApi } from '../../../context/ApiContext';
export default function AdminDashboard() {

  const {logout } = useApi();

  const handleLogout = () => {
logout();
  }

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <aside
        className="bg-dark text-white p-3"
        style={{
          width: '220px',
          minHeight: '100vh',
          position: 'fixed', // Fixed the sidebar on the left
        }}
      >
        <h4>Admin Panel</h4>
        <ul className="nav flex-column mt-4">
          
          <li className="nav-item">
            <NavLink to="/admin/users" className="nav-link text-white">👥 Users</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/admin/add-user" className="nav-link text-white">➕ Add User</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/admin/notifications" className="nav-link text-white">🔔 Notifications</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/admin" className="nav-link text-white">😄 Profile</NavLink>
          </li>  
          <li className="nav-item">
            <button className="btn btn-danger w-100 mt-4 py-2" onClick={() => handleLogout()}>
              Logout
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main
        className="p-4 flex-grow-1"
        style={{
          marginLeft: '220px', // Make space for the fixed sidebar
          overflowY: 'auto', // Allow the main content to overflow when it exceeds the height
          height: '100vh', // Ensure the content takes full height of the screen
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
