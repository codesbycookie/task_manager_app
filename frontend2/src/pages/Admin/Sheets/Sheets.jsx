import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AddTask from "../AddTask/AddTask";
import Modal from "react-bootstrap/Modal";
import { useApi } from "../../../context/ApiContext";
import EditTask from "../EditTask/EditTask";

export default function Sheets() {
  const { userId } = useParams();
  const [selectedMonth, setSelectedMonth] = useState("2025-04");
  const [selectedDate, setSelectedDate] = useState(null);
  const [expandedTask, setExpandedTask] = useState(null);
  const [addTaskshow, setAddTaskShow] = useState(false); // <-- Added state for modal control
  const [editTaskShow, setEditTaskShow] = useState(false);
  const [deleteTaskShow, setDeleteTaskShow] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const { tasks, delete_task, fetch_tasks } = useApi();

  useEffect(() => {
    fetch_tasks(userId);
  }, [userId]);

  const handleAddTaskClose = () => setAddTaskShow(false);
  const handleAddTaskShow = () => setAddTaskShow(true);
  const handleEditTaskClose = () => {
    setEditTaskShow(false);
    setSelectedTask(null);
  };
  const handleEditTaskShow = (task) => {
    setSelectedTask(task);
    setEditTaskShow(true);
  };

  const handleDeleteTaskClose = () => {
    setDeleteTaskShow(false);
    setSelectedTask(null);
  };
  const handleDeleteTaskShow = (task) => {
    setSelectedTask(task);
    setDeleteTaskShow(true);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await delete_task(taskId, userId);
      handleDeleteTaskClose();
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Error deleting task");
    } finally {
      handleDeleteTaskClose();
      fetch_tasks(userId);
      setSelectedTask(null);
      setDeleteTaskShow(false);
      setSelectedDate(null);
      setExpandedTask(null);
    }
  };

  const [year, month] = selectedMonth.split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();

  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    return { day, dateStr: `${selectedMonth}-${String(day).padStart(2, "0")}` };
  });

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toISOString().split("T")[0];
  };

  // Filter tasks for selected date
  const tasksForSelectedDate = tasks.filter((task) => {
    return formatDate(task.deadline) === selectedDate;
  });

  return (
    <div className="container-fluid mt-4">
      <h3>Task Sheet for User ID: {userId}</h3>

      <div className="mb-3">
        <label className="me-2">Select Month:</label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="form-control w-auto d-inline"
        />
      </div>

      <div className="row row-cols-7 g-2 mb-4">
        {calendarDays.map(({ day, dateStr }) => (
          <div key={day} className="col">
            <div
              className={`p-3 border rounded text-center bg-light ${
                selectedDate === dateStr ? "border-dark border-2" : ""
              }`}
              style={{ minHeight: "80px", cursor: "pointer" }}
              onClick={() => setSelectedDate(dateStr)}
            >
              <strong>{day}</strong>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="btn btn-primary m-4"
        onClick={handleAddTaskShow}
      >
        Add New Task 
      </button>

      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Description</th>

              <th>Status</th>
              <th>Priority</th>
              <th>Deadline</th>
              <th>Actions</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            {selectedDate === null ? (
              <>
                <tr>
                  <td colSpan="9" className="text-center text-muted">
                    Select a date to view tasks
                  </td>
                </tr>
              </>
            ) : tasksForSelectedDate.length === 0 ? (
              <>
                <tr>
                  <td colSpan="9" className="text-center text-muted">
                    No tasks assigned for {selectedDate}
                  </td>
                </tr>
              </>
            ) : (
              tasksForSelectedDate.map((task) => (
                <React.Fragment key={task._id}>
                  <tr>
                    <td>{task.title}</td>
                    <td>{task.description}</td>

                    <td>{task.status}</td>
                    <td>{task.priority}</td>
                    <td>{formatDate(task.deadline)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEditTaskShow(task)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteTaskShow(task)}
                      >
                        Delete
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() =>
                          setExpandedTask(
                            expandedTask === task._id ? null : task._id
                          )
                        }
                      >
                        {expandedTask === task._id
                          ? "Hide Comments"
                          : "View Comments"}
                      </button>
                    </td>
                  </tr>

                  {expandedTask === task._id && (
                    <tr>
                      <td colSpan="9">
                        <div className="p-2 bg-light border">
                          <h6>Comments</h6>
                          {task.comments.length > 0 ? (
                            <ul
                              className="m-0 p-0"
                              style={{ listStyle: "none" }}
                            >
                              {task.comments.map((comment, index) => (
                                <li key={index} className="mb-1">
                                  • {comment}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>No comments available</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Modal size="xl" show={deleteTaskShow} onHide={handleDeleteTaskClose}>
        <Modal.Header closeButton>
          <Modal.Title className="px-4">
            {" "}
            <h1 className="modal-title card-title fs-5 mt-2">delete Task</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="p-3">
            are you sure want to delete this <b>task Id: </b>
            {selectedTask?._id} ?
            <button
              className="btn btn-danger"
              onClick={() => handleDeleteTask(selectedTask?._id)}
            >
              Delete task
            </button>
          </div>
        </Modal.Body>
      </Modal>
      <Modal size="xl" show={editTaskShow} onHide={handleEditTaskClose}>
        <Modal.Header closeButton>
          <Modal.Title className="px-4">
            {" "}
            <h1 className="modal-title card-title fs-5 mt-2">edit Task</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="p-3">
            <EditTask
              closeModal={handleEditTaskClose}
              userId={userId}
              taskData={selectedTask}
              selectedDate={selectedDate}
            />
          </div>
        </Modal.Body>
      </Modal>
      <Modal size="xl" show={addTaskshow} onHide={handleAddTaskClose}>
        <Modal.Header closeButton>
          <Modal.Title className="px-4">
            {" "}
            <h1 className="modal-title card-title fs-5 mt-2">addTask</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="p-3">
            <AddTask
              closeModal={handleAddTaskClose}
              userId={userId}
              selectedDate={selectedDate}
            />
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
