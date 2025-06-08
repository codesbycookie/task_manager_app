import React, { useState, useEffect } from "react";
import { useApi } from "../../../context/ApiContext";
import { useNavigate, useLocation } from "react-router-dom";
import {getRequest} from '../../../utils/ApiService'
import './EditTask.css'


export default function EditTask() {
  const navigate = useNavigate();
  const location = useLocation();
  const { editTask, admin } = useApi();

  // Get task from location state
  const task = location.state?.task;

  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState("");
  const [date, setDate] = useState("");
  const [days, setDays] = useState([]);
  const [dates, setDates] = useState("");
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [users, setUsers] = useState([]);

  const dayOptions = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  useEffect(() => {
    // If no task in location.state, redirect back or handle error
    if (!task) {
      alert("No task data found");
      navigate("/admin/tasks");
      return;
    }

    // Prefill form state from task
    setTitle(task.title || "");
    setFrequency(task.frequency || "");
    setAssignedUsers(task.users_assigned || []);

    if (task.frequency === "once") {
      setDate(task.date || "");
    } else if (task.frequency === "weekly") {
      setDays(task.days || []);
    } else if (task.frequency === "monthly") {
      setDates(task.dates ? task.dates.join(", ") : "");
    }
  }, [task, navigate]);

  // Fetch users for assigning
   useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getRequest(
          "http://localhost:3000/api/user/get-all-users",
          {},
          { admin_uid: admin.uid }
        );
        console.log(response);
        setUsers(response.users);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedTask = {
        _id:task._id,
      title,
      frequency,
      users_assigned: assignedUsers,
      ...(frequency === "once" && { date }),
      ...(frequency === "weekly" && { days }),
      ...(frequency === "monthly" && {
        dates: dates.split(",").map((d) => parseInt(d.trim())),
      }),
    };

    try {
      await editTask(updatedTask);
    } catch (error) {
      console.error(error);
      alert("Failed to update task");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <h3 className="mb-3">Edit Task</h3>

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
            checked={assignedUsers.length === users.length && users.length > 0}
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
              {user.branch ? user.branch.name + " Branch" : "Branch may be deleted"})
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

      <button type="submit" className="btn btn-primary me-2">
        Update Task
      </button>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => navigate(-1)}
      >
        Cancel
      </button>
    </form>
  );
}
