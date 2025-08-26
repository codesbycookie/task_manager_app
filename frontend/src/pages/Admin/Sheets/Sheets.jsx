import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Modal, Button, Spinner, Form, Badge } from "react-bootstrap";
import { useApi } from "../../../context/ApiContext";
import {
  MdOutlineEdit,
  MdDelete,
  MdAdd,
  MdChevronLeft,
  MdChevronRight,
  MdToday,
} from "react-icons/md";
import { getFilteredTaskStatuses } from "../../../utils/StatusFilter";
import "./Sheets.css";
import { IoIosRefresh } from "react-icons/io";

export default function AdminSheets() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { deleteTask, fetchTasksForAdmin, tasks, sheetUser, loading } =
    useApi();

  const [showModal, setShowModal] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    // Only fetch if userId exists and tasks/sheetUser is not already set
    if (userId && !sheetUser?._id) {
      // console.log("Fetching tasks for user:", userId, "on date:", selectedDate.toISOString().split('T')[0]);
      fetchTasksForAdmin(userId, selectedDate.toISOString().split("T")[0]);
    }
  }, [userId, selectedDate]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setSelectedDayIndex(date.getDay());
  };

  const handleEdit = (task) => {
    navigate("/admin/edit-task", { state: { task, user: sheetUser } });
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
    // console.log("Filtering tasks for date:", tasks);
    return getFilteredTaskStatuses(tasks, selectedDate, statusFilter);
  }, [tasks, selectedDate, statusFilter]);

  // console.log("Filtered tasks:", filteredTasks);

  const daysInMonth = getDaysInMonth(selectedDate);

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <Badge bg="success" className="px-3 py-2">
            ✅ Completed
          </Badge>
        );
      case "missed":
        return (
          <Badge bg="danger" className="px-3 py-2">
            ❌ Missed
          </Badge>
        );
      case "yet to complete":
        return (
          <Badge bg="warning" className="px-3 py-2">
            ⏳ Yet to Complete
          </Badge>
        );
      default:
        return (
          <Badge bg="warning" className="px-3 py-2">
            ⚠️ Not Completed
          </Badge>
        );
    }
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  return (
    <div
      className="container-fluid py-4 px-lg-5"
      style={{ maxWidth: "1400px" }}
    >
      {/* Header Section */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4">
        <div className="mb-3 mb-md-0">
          <h2 className="mb-1 text-dark fw-bold">
            {sheetUser.name}'s Task Dashboard
          </h2>
          <div className="d-flex align-items-center">
            <span className="text-muted me-2">Last Login:</span>
            <span className="fw-semibold">
              {sheetUser.last_login
                ? formatDateTime(sheetUser.last_login)
                : "Never logged in"}
            </span>
          </div>
        </div>
        <div className="d-flex gap-3">
          <Button
            variant="primary"
            size="lg"
            className="d-flex align-items-center shadow-sm"
            href="/admin/add-task"
          >
            <MdAdd size={20} className="me-1" />
            Add New Task
          </Button>
          <a
            style={{ fontSize: "20px" }}
            className="btn btn-primary d-flex align-items-center shadow-sm px-3"
            onClick={() => fetchTasksForAdmin(userId)}
          >
            <IoIosRefresh size={22} className="me-1" />
            Refresh
          </a>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="card shadow-sm mb-4 border-0">
        <div className="card-body p-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Button
              variant="outline-secondary"
              onClick={goToPreviousMonth}
              className="rounded-circle p-2"
            >
              <MdChevronLeft size={24} />
            </Button>

            <div className="text-center">
              <h3 className="m-0 text-dark fw-bold">
                {selectedDate.toLocaleString("default", { month: "long" })}{" "}
                {selectedDate.getFullYear()}
              </h3>
              <Button
                variant="outine-secondary"
                size="sm"
                className="mt-1"
                onClick={goToToday}
              >
                <MdToday className="me-1" />
                Today
              </Button>
            </div>

            <Button
              variant="outline-secondary"
              onClick={goToNextMonth}
              className="rounded-circle p-2"
            >
              <MdChevronRight size={24} />
            </Button>
          </div>

          {/* Weekday Headers */}
          <div className="row row-cols-7 g-1 mb-2 text-center">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
              (day, idx) => (
                <div key={day} className="col">
                  <div
                    className={`small fw-bold ${
                      selectedDayIndex === idx ? "text-primary" : "text-muted"
                    }`}
                  >
                    {day}
                  </div>
                </div>
              )
            )}
          </div>

          {/* Calendar Days */}
          <div className="row row-cols-7 g-1">
            {daysInMonth.map((day, i) => {
              const isToday = isSameDate(day, new Date());
              const isSelected = isSameDate(day, selectedDate);
              const hasTasks = tasks.some((task) =>
                isSameDate(new Date(task.date), day)
              );

              return (
                <div key={i} className="col p-1">
                  <div
                    className={`d-flex flex-column align-items-center justify-content-center rounded-3 p-2 cursor-pointer 
                      ${isSelected ? "bg-primary text-white" : ""}
                      ${isToday && !isSelected ? "border border-primary" : ""}
                      ${hasTasks ? "has-tasks" : ""}`}
                    style={{
                      height: "48px",
                      position: "relative",
                      transition: "all 0.2s ease",
                    }}
                    onClick={() => handleDateClick(day)}
                  >
                    <span className={`${isSelected ? "fw-bold" : ""}`}>
                      {day.getDate()}
                    </span>
                    {isToday && (
                      <div
                        className="position-absolute bottom-1"
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          backgroundColor: isSelected ? "white" : "#8dc540",
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tasks Section with Scrollable Table Body */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white border-0 pt-4 pb-3">
          <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between">
            <div className="mb-3 mb-md-0">
              <h3 className="m-0 text-dark fw-bold">
                Tasks for{" "}
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
              <small className="text-muted">
                Showing {filteredTasks.length}{" "}
                {filteredTasks.length === 1 ? "task" : "tasks"}
              </small>
            </div>

            <div className="d-flex align-items-center">
              <Form.Group className="me-3">
                <Form.Select
                  size="lg"
                  className="shadow-sm"
                  style={{ minWidth: "220px" }}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Tasks</option>
                  <option value="completed">Completed</option>
                  <option value="missed">Missed</option>
                  <option value="not completed">Not Completed</option>
                </Form.Select>
              </Form.Group>
            </div>
          </div>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3 text-muted">Loading tasks...</p>
            </div>
          ) : (
            <div
              className="table-responsive"
              style={{ maxHeight: "60vh", overflowY: "auto" }}
            >
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light sticky-top">
                  <tr>
                    {/* <th className="">Id</th> */}
                    <th className="">No.</th>

                    <th className="ps-4">Task Title</th>
                    <th>Frequency</th>
                    <th>Schedule</th>
                    <th>Status</th>
                    <th>Created At</th>
                    <th>Completed At</th>
                    <th className="pe-4 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((sheet, idx) => (
                    <tr
                      key={sheet._id}
                      className={
                        sheet.status === "completed"
                          ? "bg-success bg-opacity-10"
                          : sheet.status === "missed"
                          ? "bg-danger bg-opacity-10"
                          : ""
                      }
                      style={{ height: "60px" }} // Fixed row height
                    >
                      {/* <td>{sheet.task._id} {sheet._id}</td> */}
                      <td>
                        <b>{idx + 1}.</b>
                      </td>

                      <td className="ps-4 fw-semibold">{sheet.task.title}</td>
                      <td>
                        <Badge bg="secondary" className="text-capitalize">
                          {sheet.task.frequency}
                        </Badge>
                      </td>
                      <td>
                        {(() => {
                          const { frequency, days, dates, date } = sheet.task;
                          if (frequency === "daily") return "Every day";
                          if (frequency === "weekly" && days?.length > 0)
                            return days.join(", ");
                          if (frequency === "monthly" && dates?.length > 0)
                            return dates.join(", ");
                          if (frequency === "once" && date)
                            return new Date(date).toLocaleDateString();
                          return "-";
                        })()}
                      </td>
                      <td>{getStatusBadge(sheet.status)}</td>
                      <td>
                        <small className="text-muted">
                          {formatDateTime(sheet.task.createdAt)}
                        </small>
                      </td>
                      <td>
                        {sheet.status === "completed" && sheet.date !== "-" ? (
                          <small className="text-muted">
                            {formatDateTime(sheet.completedAt)}
                          </small>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td className="pe-4 text-end" id="table-actions">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleEdit(sheet.task)}
                          className="me-2 rounded-circle"
                          style={{ width: "32px", height: "32px" }}
                          id="table-button"
                        >
                          <MdOutlineEdit size={16} />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteClick(sheet)}
                          className="rounded-circle"
                          style={{ width: "32px", height: "32px" }}
                          id="table-button"
                        >
                          <MdDelete size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filteredTasks.length === 0 && (
                    <tr style={{ height: "200px" }}>
                      <td colSpan="7" className="text-center py-5">
                        <div className="d-flex flex-column align-items-center justify-content-center">
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png"
                            alt="No tasks"
                            style={{ width: "120px", opacity: 0.7 }}
                            className="mb-3"
                          />
                          <h5 className="text-muted mb-3">
                            No tasks for this day
                          </h5>
                          <Button
                            variant="primary"
                            href="/admin/add-task"
                            className="d-flex align-items-center"
                          >
                            <MdAdd className="me-1" />
                            Create Task
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4">
          <div className="text-center mb-4">
            <div className="bg-danger bg-opacity-10 d-inline-flex p-3 rounded-circle mb-3">
              <MdDelete size={32} className="text-danger" />
            </div>
            <h5 className="fw-bold mb-2">
              Delete "{selectedSheet?.task?.title}"?
            </h5>
            <p className="text-muted">
              This action cannot be undone. All data related to this task will
              be permanently removed.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button
            variant="outline-secondary"
            onClick={() => setShowModal(false)}
            className="px-4"
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete} className="px-4">
            Delete Task
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
