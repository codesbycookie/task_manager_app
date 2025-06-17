/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Modal, Button, Spinner, Form } from "react-bootstrap";
import { useApi } from "../../../context/ApiContext";
import "./Sheets.css";
import { MdOutlineEdit, MdDelete } from "react-icons/md";
import { getFilteredTaskStatuses } from "../../../utils/StatusFilter";

export default function AdminSheets() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { deleteTask, fetchTasksForAdmin, tasks } = useApi();

  const [showModal, setShowModal] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [today, setToday] = useState(new Date());

  useEffect(() => {
    setLoading(true);
    fetchTasksForAdmin(userId, selectedDate).finally(() => setLoading(false));
  }, [
    userId,
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate(),
  ]);

  const isSameDate = (d1, d2) => {
    const a = new Date(d1);
    const b = new Date(d2);
    a.setHours(0, 0, 0, 0);
    b.setHours(0, 0, 0, 0);
    return a.getTime() === b.getTime();
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => new Date(year, month, i + 1));
  };

  const goToPreviousMonth = () => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1)
    );
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setSelectedDayIndex(date.getDay());
  };

  const handleEdit = (task) => {
    navigate("/admin/edit-task", { state: { task } });
  };

  const handleDeleteClick = (task) => {
    setSelectedSheet(task);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteTask(selectedSheet._id, userId, selectedDate);
      setShowModal(false);
      setSelectedSheet(null);
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const filteredTasks = useMemo(() => {
    return getFilteredTaskStatuses(tasks, selectedDate, statusFilter);
  }, [tasks, selectedDate, statusFilter]);

  const daysInMonth = getDaysInMonth(selectedDate);

  console.log(tasks);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button variant="outline-secondary" onClick={goToPreviousMonth}>
          &lt;
        </Button>
        <h4 className="m-0">
          {selectedDate.toLocaleString("default", { month: "long" })}{" "}
          {selectedDate.getFullYear()}
        </h4>
        <Button variant="outline-secondary" onClick={goToNextMonth}>
          &gt;
        </Button>
      </div>

      <div className="row row-cols-7 text-center mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => (
          <div
            key={day}
            className={`col fw-bold ${
              selectedDayIndex === idx ? "text-warning fw-bold" : ""
            }`}
          >
            {day}
          </div>
        ))}
        {daysInMonth.map((day, i) => {
          const isToday = isSameDate(day, new Date());
          const isSelected = isSameDate(day, selectedDate);
          return (
            <div
              key={i}
              className={`col border rounded m-1 py-1 cursor-pointer`}
              style={
                isSelected
                  ? {
                      fontWeight: "bold",
                      cursor: "pointer",
                      color: "#8dc540",
                      backgroundColor: "#fac116",
                    }
                  : isToday
                  ? {
                      fontWeight: "bold",
                      cursor: "pointer",
                      backgroundColor: "#8dc540",
                      color: "#fac116",
                    }
                  : {}
              }
              onClick={() => handleDateClick(day)}
            >
              {day.getDate()}
            </div>
          );
        })}
      </div>

      <div className="d-flex align-items-center mb-3">
        <h2 className="m-0">Tasks on {selectedDate.toDateString()}</h2>
        <Form.Select
          size="sm"
          className="ms-3"
          style={{ width: "200px" }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="missed">Missed</option>
          <option value="not completed">Not Completed</option>
        </Form.Select>
        <a
          href={`/admin/add-task`}
          className="btn btn-primary ms-auto p-2"
          style={{ height: "40px" }}
        >
          Add Task
        </a>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="success" />
        </div>
      ) : (
        <div className="table-responsive">
          <table
            className="table table-bordered table-hover"
            style={styles.greencolored2}
          >
            <thead>
              <tr>
                <th style={styles.greencolored}>Title</th>
                <th style={styles.greencolored}>Frequency</th>
                <th style={styles.greencolored}>Days / Dates / Date</th>
                <th style={styles.greencolored}>Status</th>
                <th style={styles.greencolored}>Created At</th>
                <th style={styles.greencolored}>Completed at</th>
                <th style={styles.greencolored}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((sheet) => (
                <tr
                  key={sheet._id}
                  className={
                    sheet.status === "completed"
                      ? "table-success text-white"
                      : sheet.status === "missed"
                      ? "table-danger text-white"
                      : "table-light"
                  }
                >
                  <td>{sheet.task.title}</td>
                  <td>{sheet.task.frequency}</td>
                  <td>
                    {(() => {
                      const { frequency, days, dates, date } = sheet.task;
                      if (frequency === "daily") return "Everyday";
                      if (frequency === "weekly" && days?.length > 0)
                        return days.join(", ");
                      if (frequency === "monthly" && dates?.length > 0)
                        return dates.join(", ");
                      if (frequency === "once" && date)
                        return new Date(date).toLocaleDateString();
                      return "-";
                    })()}
                  </td>
                  <td>{sheet.status}</td>
                  <td>{new Date(sheet.task.createdAt).toLocaleString()}</td>
                  <td>
                    {sheet.status === "completed"
                      ? sheet.date !== "-"
                        ? new Date(sheet.date).toLocaleString()
                        : "-"
                      : "not yet completed"}
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleEdit(sheet.task)}
                      className="me-2"
                    >
                      <MdOutlineEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteClick(sheet)}
                    >
                      <MdDelete />
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center">
                    No tasks for this {selectedDate.toLocaleDateString()}
<br />
                    <a
          href={`/admin/add-task`}
          className="btn btn-primary ms-auto p-2 mt-3"
          style={{ height: "40px" }}
        >
          Add Task for today 
        </a>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete{" "}
          <strong>{selectedSheet?.task?.title}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

const styles = {
  greencolored: { color: "#8dc540" },
  greencolored2: { borderColor: "#8dc540", textAlign: "center" },
};
