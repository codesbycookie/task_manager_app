/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useApi } from "../../../context/ApiContext";
import { getRequest, postRequest } from "../../../utils/ApiService";
export default function AddTask() {
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState("");
  const [date, setDate] = useState("");
  const [days, setDays] = useState([]);
  const [dates, setDates] = useState("");
  const [assignedUsers, setAssignedUsers] = useState([]);

  const { assignTask, admin, users } = useApi();

  console.log(admin)



  console.log(users);

  const dummyUsers = [
    {
      _id: "682eff61a55efa0aba3c6dce",
      name: "New User2",
      email: "newuser2@example.com",
    },
    {
      _id: "682eff61a55efa0aba3c6dcf",
      name: "Alice Walker",
      email: "alice@example.com",
    },
    {
      _id: "682eff61a55efa0aba3c6dd0",
      name: "Bob Johnson",
      email: "bob@example.com",
    },
  ];

  const dayOptions = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const toggleDay = (day) => {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleUser = (userId) => {
    setAssignedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const task = {
      title,
      frequency,
      users_assigned: assignedUsers,
      ...(frequency === "once" && { date }),
      ...(frequency === "weekly" && { days: days }),
      ...(frequency === "monthly" && {
        dates: dates.split(",").map((d) => parseInt(d.trim())),
      }),
    };

    console.log("New Task:", task);
    assignTask(task);
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <h3 className="mb-3">Add New Task</h3>

      <div className="mb-3">
        <label className="form-label">Task Title</label>
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Assign Users</label>

        <div className="form-check mb-2">
          <input
            className="form-check-input"
            type="checkbox"
            id="select-all-users"
            checked={assignedUsers.length === users.length}
            onChange={(e) => {
              if (e.target.checked) {
                setAssignedUsers(users.map((user) => user._id));
              } else {
                setAssignedUsers([]);
              }
            }}
          />
          <label
            className="form-check-label fw-bold"
            htmlFor="select-all-users"
          >
            Select All
          </label>
        </div>

        {users.map((user) => (
          <div className="form-check" key={user._id}>
            <input
              className="form-check-input"
              type="checkbox"
              id={`user-${user._id}`}
              checked={assignedUsers.includes(user._id)}
              onChange={() => toggleUser(user._id)}
            />
            <label className="form-check-label" htmlFor={`user-${user._id}`}>
              {user.name} ({user.email}) (
              {user.branch
                ? user.branch.name + " Branch"
                : "Branch may be deleted"}
              )
            </label>
          </div>
        ))}
      </div>

      <div className="mb-3">
        <label className="form-label">Frequency</label>
        <select
          className="form-select"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          required
        >
          <option value="">Select frequency</option>
          <option value="daily">Daily</option>
          <option value="once">Once</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {frequency === "once" && (
        <div className="mb-3">
          <label className="form-label">Select Date</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
      )}

      {frequency === "weekly" && (
        <div className="mb-3">
          <label className="form-label d-block">Select Days of the Week</label>
          {dayOptions.map((day) => (
            <div className="form-check form-check-inline" key={day}>
              <input
                className="form-check-input"
                type="checkbox"
                id={`day-${day}`}
                checked={days.includes(day)}
                onChange={() => toggleDay(day)}
              />
              <label className="form-check-label" htmlFor={`day-${day}`}>
                {day}
              </label>
            </div>
          ))}
        </div>
      )}

      {frequency === "monthly" && (
        <div className="mb-3">
          <label className="form-label">Enter Dates (comma-separated)</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. 1, 15, 30"
            value={dates}
            onChange={(e) => setDates(e.target.value)}
            required
          />
        </div>
      )}

      <button type="submit" className="btn btn-primary">
        Create Task
      </button>
    </form>
  );
}
