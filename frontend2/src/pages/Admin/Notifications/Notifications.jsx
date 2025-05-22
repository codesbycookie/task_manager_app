import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useApi } from "../../../context/ApiContext";

const Notifications = () => {
  // const notifications = [
  //   { id: 1, message: "You have a new task assigned.", timestamp: "2025-04-21 10:00 AM" },
  //   { id: 2, message: "Your task 'Complete Report' is due tomorrow.", timestamp: "2025-04-21 09:30 AM" },
  //   { id: 3, message: "You have a new comment on your task.", timestamp: "2025-04-20 05:00 PM" },
  // ];

  const {notifications, fetch_notifications} = useApi();

  return (
    <div className="container mt-5">
      <h3 className="text-center mb-4">Notifications
        <div className="d-inline-flex ms-auto">
          <button className="btn btn-primary" onClick={() => fetch_notifications()}>Refresh</button>
        </div>
      </h3>
      <div className="list-group">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="list-group-item list-group-item-action p-3 mb-2 shadow-sm rounded"
            style={{
              backgroundColor: "#f8f9fa",
              borderLeft: "5px solid #007bff",
              transition: "all 0.3s ease",
            }}
          >
            <div className="d-flex justify-content-between">
              <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                {notification.title || "New user Added"} <br />
                {notification.body} <br />
                { notification?.user_id ? `User Id: ${notification?.user_id?._id}` : 'The user has been deleted'} <br />
              </span>
              <span className="text-muted" style={{ fontSize: "0.85rem" }}>
                {notification.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
