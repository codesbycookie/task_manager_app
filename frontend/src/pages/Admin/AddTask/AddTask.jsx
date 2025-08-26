import React, { useState} from "react";
import { useApi } from "../../../context/ApiContext";
export default function AddTask() {
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState("");
  const [date, setDate] = useState("");
  const [days, setDays] = useState([]);
  const [dates, setDates] = useState("");
  const [assignedUsers, setAssignedUsers] = useState([]);

  const { assignTask, users } = useApi();


  const dayOptions = [
  { label: "Sunday", value: "Sunday" },
  { label: "Monday", value: "Monday" },
  { label: "Tuesday", value: "Tuesday" },
  { label: "Wednesday", value: "Wednesday" },
  { label: "Thursday", value: "Thursday" },
  { label: "Friday", value: "Friday" },
  { label: "Saturday", value: "Saturday" },
];

const presetGroups = [
  { label: "Mon, Wed, Fri", value: ["Monday", "Wednesday", "Friday"] },
  { label: "Tue, Thu, Sat", value: ["Tuesday", "Thursday", "Saturday"] },
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

  const handleSubmit = async (e) => {
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

    await assignTask(task);
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4 ms-0">
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
                      min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
      )}

      {frequency === "weekly" && (
  <div className="mb-3">
    <label className="form-label d-block">Select Days of the Week</label>

    {/* Preset Buttons */}
    {presetGroups.map((group) => (
      <button
        type="button"
        style={{color:'white'}}
        key={group.label}
        className="btn btn-outline-secondary btn-sm me-2 mb-2"
        onClick={() => {
          const alreadySelected = group.value.every((d) => days.includes(d));
          setDays((prev) =>
            alreadySelected
              ? prev.filter((d) => !group.value.includes(d)) // remove group
              : [...new Set([...prev, ...group.value])] // add group
          );
        }}
      >
        {group.label}
      </button>
    ))}

    {/* Custom Day Selection */}
    {dayOptions.map((day) => (
      <div className="form-check form-check-inline" key={day.value}>
        <input
          className="form-check-input"
          type="checkbox"
          id={`day-${day.value}`}
          checked={days.includes(day.value)}
          onChange={() => toggleDay(day.value)}
        />
        <label className="form-check-label" htmlFor={`day-${day.value}`}>
          {day.label}
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
