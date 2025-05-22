import React, { useState } from "react";
import Sheets from "../Sheets/Sheets";
import Main from "../Main/Main";
import AddStaff from "../AddStaff/AddStaff";
import RecentInteractions from "../RecentInteractions/RecentInteractions";
import StaffPerformance from "../StaffPerformance/StaffPerformance";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedUser, setSelectedUser] = useState(null);

  const dummyUsers = [
    {
      name: "User 1",
      email: "user1@example.com",
      img: "https://www.flaticon.com/free-icon/user_149071",
    },
    {
      name: "User 2",
      email: "user2@example.com",
      img: "https://www.flaticon.com/free-icon/user_149071",
    },
    {
      name: "User 3",
      email: "user3@example.com",
      img: "https://www.flaticon.com/free-icon/user_149071",
    },
    {
      name: "User 4",
      email: "user4@example.com",
      img: "https://www.flaticon.com/free-icon/user_149071",
    },
    {
      name: "User 5",
      email: "user5@example.com",
      img: "https://www.flaticon.com/free-icon/user_149071",
    },
    {
      name: "User 6",
      email: "user6@example.com",
      img: "https://www.flaticon.com/free-icon/user_149071",
    },
    {
      name: "User 7",
      email: "user7@example.com",
      img: "https://www.flaticon.com/free-icon/user_149071",
    },
    {
      name: "User 8",
      email: "user8@example.com",
      img: "https://www.flaticon.com/free-icon/user_149071",
    },
    {
      name: "User 9",
      email: "user9@example.com",
      img: "https://www.flaticon.com/free-icon/user_149071",
    },
    {
      name: "User 10",
      email: "user10@example.com",
      img: "https://www.flaticon.com/free-icon/user_149071",
    },
  ];

  const renderContent = () => {
    if (selectedUser) {
      return (
        <Sheets
          selectedUser={selectedUser}
          onBack={() => setSelectedUser(null)}
        />
      );
    }

    if (activeTab === "dashboard") {
      return <Main />;
    } else if (activeTab == "addStaff") {
      return <AddStaff />;
    } else if (activeTab == "recentInteractions") {
      return <RecentInteractions />;
    }else if (activeTab == "staffPerformance") {
      return <StaffPerformance/>;
    } else if (activeTab === "users") {
      return (
        <div>
          <h2>User List</h2>
          <div className="row">
            {dummyUsers.map((user, index) => (
              <div className="col-md-6 col-lg-4 mb-4" key={index}>
                <div
                  className="card shadow-sm h-100"
                  onClick={() => setSelectedUser(user.name)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-center align-items-center">
                      <img
                        src="/avatar.png"
                        style={{
                          height: "100px",
                          width: "100px",
                          objectFit: "contain",
                        }}
                        alt=""
                      />
                    </div>
                    <h5 className="card-title">{user.name}</h5>
                    <p className="card-text">{user.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="row min-vh-100 g-0">
        {/* Sidebar */}
        <div
          className="col-md-3 col-lg-2 bg-dark text-white p-3"
          style={{
            overflowY: "auto",
            position: "sticky",
            top: 0,
            height: "100vh",
          }}
        >
          <h4 className="mb-4">Admin Panel</h4>
          <ul className="nav flex-column">
            <li className="nav-item">
              <button
                className="nav-link text-white btn btn-link"
                onClick={() => {
                  setActiveTab("dashboard");
                  setSelectedUser(null);
                }}
              >
                Dashboard
              </button>
            </li>

            <li className="nav-item">
              <button
                className="nav-link text-white btn btn-link"
                onClick={() => {
                  setActiveTab("users");
                  setSelectedUser(null);
                }}
              >
                Users
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link text-white btn btn-link"
                onClick={() => {
                  setActiveTab("addStaff");
                  setSelectedUser(null);
                }}
              >
                Add Staff
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link text-white btn btn-link"
                onClick={() => {
                  setActiveTab("recentInteractions");
                  setSelectedUser(null);
                }}
              >
                Recent Interactions
              </button>
            </li>

            <li className="nav-item">
              <button
                className="nav-link text-white btn btn-link"
                onClick={() => {
                  setActiveTab("staffPerformance");
                  setSelectedUser(null);
                }}
              >
                Staff Performance
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link text-white btn btn-link"
                onClick={() => {
                  setActiveTab("users");
                  setSelectedUser(null);
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>

        {/* Content Area */}
        <div className="col-md-9 col-lg-10 p-4">{renderContent()}</div>
      </div>
    </div>
  );
}
