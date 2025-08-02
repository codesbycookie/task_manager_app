import React, { useState } from "react";
import { useApi } from "../../../context/ApiContext";
import "./AddUser.css";

export default function AddUser() {
  const { addUser, users, branches, fetchTasksForAddUserPage } = useApi();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    branch: "",
    phone_number: "",
    address: "",
    copyFromUserId: "",
  });

  const [taskOptions, setTaskOptions] = useState([]); // tasks of selected user
  const [selectedUserTasks, setSelectedUserTasks] = useState([]); // selected task IDs

  const handleChange = async (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "copyFromUserId") {
      try {
        const tasks = await fetchTasksForAddUserPage(value);
        setTaskOptions(tasks || []);
        setSelectedUserTasks([]);
      } catch (err) {
        console.error("Failed to fetch user tasks", err);
        setTaskOptions([]);
        setSelectedUserTasks([]);
      }
    }
  };

  const handleTaskToggle = (taskId) => {
    if (selectedUserTasks.includes(taskId)) {
      setSelectedUserTasks(selectedUserTasks.filter((id) => id !== taskId));
    } else {
      setSelectedUserTasks([...selectedUserTasks, taskId]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      tasksToCopy: selectedUserTasks,
    };

    addUser(payload);

    // Reset
    setFormData({
      name: "",
      email: "",
      branch: "",
      phone_number: "",
      address: "",
      copyFromUserId: "",
    });
    setTaskOptions([]);
    setSelectedUserTasks([]);
  };

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.branch.trim() !== "" &&
    formData.phone_number.trim() !== "" &&
    formData.address.trim() !== "";

  return (
    <div className="container mt-5 ms-0">
      <h2 className="mb-4">Add New User</h2>
      <form onSubmit={handleSubmit}>
        {/* Copy From User */}
        <div className="mb-3">
          <label className="form-label">Copy Tasks From User</label>
          {users.length === 0 && <p>No users available</p>}
          {users.map((user) => (
            <div key={user._id}>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  required
                  name="copyFromUserId"
                  id={`copy-user-${user._id}`}
                  value={user._id}
                  checked={formData.copyFromUserId === user._id}
                  onChange={handleChange}
                />
                <label
                  className="form-check-label"
                  htmlFor={`copy-user-${user._id}`}
                >
                  {user.name} ({user.email})
                </label>
              </div>

              {/* ✅ Show 'no tasks' message only for selected user */}
              {formData.copyFromUserId === user._id &&
                taskOptions.length === 0 && (
                  <div className="alert alert-info ms-3 mt-2">
                    This user has no tasks to copy.{" "}
                    <a
                      href={`/admin/users/sheets/${user._id}`}
                      className="ms-2 btn btn-sm btn-primary"
                    >
                      Add Task to this user
                    </a>
                  </div>
                )}
            </div>
          ))}
        </div>

        {/* Task Selection */}
        {taskOptions.length > 0 ? (
          <div className="mb-3">
            <label className="form-label">Select Tasks to Copy</label>
            {taskOptions.map((task) => (
              <div className="form-check" key={task._id}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  required
                  id={`task-${task._id}`}
                  checked={selectedUserTasks.includes(task._id)}
                  onChange={() => handleTaskToggle(task._id)}
                />
                <label
                  className="form-check-label"
                  htmlFor={`task-${task._id}`}
                >
                  {task.title}
                </label>
              </div>
            ))}
          </div>
        ) : (
          ""
        )}

        {/* Name */}
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Branch */}
        <div className="mb-3">
          <label className="form-label">Select Branch</label>
          {branches.map((branch) => (
            <div className="form-check" key={branch._id}>
              <input
                className="form-check-input"
                type="radio"
                name="branch"
                id={`branch-${branch._id}`}
                value={branch._id}
                checked={formData.branch === branch._id}
                onChange={handleChange}
                required
              />
              <label
                className="form-check-label"
                htmlFor={`branch-${branch._id}`}
              >
                {branch.name} ({branch.address})
              </label>
            </div>
          ))}
        </div>

        {/* Phone Number */}
        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input
            type="tel"
            name="phone_number"
            className="form-control"
            value={formData.phone_number}
            onChange={handleChange}
            pattern="[0-9]{10}"
            title="Enter a 10-digit phone number"
            required
          />
        </div>

        {/* Address */}
        <div className="mb-3">
          <label className="form-label">Address</label>
          <textarea
            name="address"
            className="form-control"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!isFormValid}
        >
          Add User
        </button>
      </form>
    </div>
  );
}
