import React, { useEffect, useState, useMemo, useRef } from "react";
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
  MdDragIndicator,
} from "react-icons/md";
import "./Sheets.css";
import { IoIosRefresh } from "react-icons/io";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useLoading } from "../../../context/LoadingContext";

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Safely parse YYYY-MM-DD strings as local time (not UTC)
const toLocalDate = (d) => {
  if (!d) return new Date();
  if (typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
    return new Date(d + "T00:00:00");
  }
  return new Date(d);
};

const isSameDate = (d1, d2) => {
  const a = toLocalDate(d1);
  const b = toLocalDate(d2);
  a.setHours(0, 0, 0, 0);
  b.setHours(0, 0, 0, 0);
  return a.getTime() === b.getTime();
};

const formatDateTime = (date) => {
  if (!date) return "-";
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

const getStatusBadge = (status) => {
  switch (status) {
    case "completed":
      return <Badge bg="success" className="px-3 py-2">✅ Completed</Badge>;
    case "missed":
      return <Badge bg="danger" className="px-3 py-2">❌ Missed</Badge>;
    case "yet to complete":
      return <Badge bg="warning" className="px-3 py-2">⏳ Yet to Complete</Badge>;
    default:
      return <Badge bg="warning" className="px-3 py-2">⚠️ Not Completed</Badge>;
  }
};

const getDaysInMonth = (date) => {
  const d = toLocalDate(date);
  const year = d.getFullYear();
  const month = d.getMonth();
  const days = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: days }, (_, i) => new Date(year, month, i + 1));
};

// ─── SortableRow ──────────────────────────────────────────────────────────────

function SortableRow({ sheet, idx, handleEdit, handleDeleteClick }) {
  // ✅ sheet.status._id is the TaskStatus _id — single source of truth
  const id = String(sheet.status._id);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform), // Translate avoids scale distortion on <tr>
    transition,
    willChange: "transform",
    opacity: isDragging ? 0.4 : 1,
    backgroundColor: isDragging ? "#eef2ff" : undefined,
    boxShadow: isDragging ? "0 4px 16px rgba(0,0,0,0.12)" : undefined,
    position: "relative",
    zIndex: isDragging ? 999 : "auto",
  };

  const taskStatusString = sheet.status.status;
  const completedAt = sheet.status.completedAt;

  return (
    <tr ref={setNodeRef} style={style} {...attributes}>

      <td
        {...listeners}
        style={{ cursor: "grab", touchAction: "none", width: "40px", userSelect: "none" }}
        title="Drag to reorder"
        onMouseDown={(e) => e.preventDefault()}
      >
        <MdDragIndicator size={18} className="text-muted" />
      </td>

      <td><b>{idx + 1}.</b></td>
      <td className="ps-4 fw-semibold">{sheet.task.title}</td>
      <td>
        <Badge bg="secondary" className="text-capitalize">
          {sheet.task.frequency}
        </Badge>
      </td>
      <td>{sheet.task.frequency}</td>
      <td>{getStatusBadge(taskStatusString)}</td>
      <td><small className="text-muted">{formatDateTime(sheet.task.createdAt)}</small></td>
      <td>
        {taskStatusString === "completed"
          ? <small className="text-muted">{formatDateTime(completedAt)}</small>
          : "-"
        }
      </td>
      <td className="pe-4 text-end">
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => handleEdit(sheet.task)}
          className="me-2 rounded-circle"
        >
          <MdOutlineEdit size={16} />
        </Button>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => handleDeleteClick(sheet)}
          className="rounded-circle"
        >
          <MdDelete size={16} />
        </Button>
      </td>
    </tr>
  );
}

// ─── AdminSheets ──────────────────────────────────────────────────────────────

export default function AdminSheets() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { deleteTask, fetchTasksForAdmin, tasks, sheetUser, reorderTasks } = useApi();

  const { loading  } = useLoading();


  const [showModal, setShowModal] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(new Date().getDay());
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [statusFilter, setStatusFilter] = useState("all");

  const lastFetchedRef = useRef({ userId: null, date: null });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  // ✅ Fetch when userId or selectedDate changes
  useEffect(() => {
    if (!userId) return;

    const alreadyFetched =
      lastFetchedRef.current.userId === userId &&
      lastFetchedRef.current.date === selectedDate;

    if (alreadyFetched) return;

    lastFetchedRef.current = { userId, date: selectedDate };
    fetchTasksForAdmin(userId, selectedDate);
  }, [userId, selectedDate]); // eslint-disable-line react-hooks/exhaustive-deps


  // In AdminSheets — clear the guard on mount so back-navigation always refetches
  useEffect(() => {
    lastFetchedRef.current = { userId: null, date: null };
  }, []); // runs once on mount


  // ✅ Force refetch helper — resets the guard then fetches
  const forceRefetch = () => {
    lastFetchedRef.current = { userId: null, date: null };
    fetchTasksForAdmin(userId, selectedDate);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date.toISOString().split("T")[0]);
    setSelectedDayIndex(date.getDay());
  };

  const goToPreviousMonth = () => {
    const d = toLocalDate(selectedDate);
    setSelectedDate(new Date(d.getFullYear(), d.getMonth() - 1, 1).toISOString().split("T")[0]);
  };
  const goToNextMonth = () => {
    const d = toLocalDate(selectedDate);
    setSelectedDate(new Date(d.getFullYear(), d.getMonth() + 1, 1).toISOString().split("T")[0]);
  };
  const goToToday = () => {
    setSelectedDate(new Date().toISOString().split("T")[0]);
  };

  const handleEdit = (task) => {
    navigate("/admin/edit-task", {
      state: { task, user: sheetUser, userId, date: selectedDate },
    });
  };

  const handleDeleteClick = (sheet) => {
    setSelectedSheet(sheet);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      // ✅ sheet.status._id is the TaskStatus _id
      await deleteTask(selectedSheet.status._id, userId, selectedDate);
      setShowModal(false);
      setSelectedSheet(null);
      forceRefetch(); // ✅ refresh after delete
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // ✅ Backend already returns resolved statuses — just apply statusFilter client-side
  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    if (statusFilter === "all") return tasks;
    return tasks.filter((sheet) => sheet.status.status === statusFilter);
  }, [tasks, statusFilter]);

  useEffect(() => {
    setTaskList(filteredTasks);
  }, [filteredTasks]);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // ✅ Match by sheet.status._id (stringified) — same as useSortable id
    const oldIndex = taskList.findIndex((t) => String(t.status._id) === active.id);
    const newIndex = taskList.findIndex((t) => String(t.status._id) === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const newList = arrayMove(taskList, oldIndex, newIndex);
    setTaskList(newList);

    // ✅ Send TaskStatus _ids in new order with date
    const orderedIds = newList.map((item) => item.status._id);
    await reorderTasks(userId, orderedIds, selectedDate);
  };

  const daysInMonth = getDaysInMonth(selectedDate);

  return (
    <div className="container-fluid py-4 px-lg-5" style={{ maxWidth: "1400px" }}>

      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4">
        <div className="mb-3 mb-md-0">
          <h2 className="mb-1 text-dark fw-bold">{sheetUser.name}'s Task Dashboard</h2>
          <div className="d-flex align-items-center">
            <span className="text-muted me-2">Last Login:</span>
            <span className="fw-semibold">
              {sheetUser.last_login ? formatDateTime(sheetUser.last_login) : "Never logged in"}
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
          <button
            className="btn btn-primary d-flex align-items-center shadow-sm px-3"
            style={{ fontSize: "20px" }}
            onClick={forceRefetch}
          >
            <IoIosRefresh size={22} className="me-1" />
            Refresh
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div className="card shadow-sm mb-4 border-0">
        <div className="card-body p-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Button variant="outline-secondary" onClick={goToPreviousMonth} className="rounded-circle p-2">
              <MdChevronLeft size={24} />
            </Button>
            <div className="text-center">
              <h3 className="m-0 text-dark fw-bold">
                {toLocalDate(selectedDate).toLocaleString("default", { month: "long" })}{" "}
                {toLocalDate(selectedDate).getFullYear()}
              </h3>
              <Button variant="outline-secondary" size="sm" className="mt-1" onClick={goToToday}>
                <MdToday className="me-1" />
                Today
              </Button>
            </div>
            <Button variant="outline-secondary" onClick={goToNextMonth} className="rounded-circle p-2">
              <MdChevronRight size={24} />
            </Button>
          </div>

          {/* Weekday headers */}
          <div className="row row-cols-7 g-1 mb-2 text-center">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => (
              <div key={day} className="col">
                <div className={`small fw-bold ${selectedDayIndex === idx ? "text-primary" : "text-muted"}`}>
                  {day}
                </div>
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="row row-cols-7 g-1">
            {daysInMonth.map((day, i) => {
              const isToday = isSameDate(day, new Date());
              const isSelected = isSameDate(day, selectedDate);
              const hasTasks = tasks?.some((sheet) => isSameDate(new Date(sheet.date), day));

              return (
                <div key={i} className="col p-1">
                  <div
                    className={`d-flex flex-column align-items-center justify-content-center rounded-3 p-2
                      ${isSelected ? "bg-primary text-white" : ""}
                      ${isToday && !isSelected ? "border border-primary" : ""}
                      ${hasTasks ? "has-tasks" : ""}`}
                    style={{ height: "48px", position: "relative", transition: "all 0.2s ease", cursor: "pointer" }}
                    onClick={() => handleDateClick(day)}
                  >
                    <span className={isSelected ? "fw-bold" : ""}>{day.getDate()}</span>
                    {isToday && (
                      <div
                        className="position-absolute bottom-1"
                        style={{
                          width: "6px", height: "6px", borderRadius: "50%",
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

      {/* Tasks Table */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white border-0 pt-4 pb-3">
          <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between">
            <div className="mb-3 mb-md-0">
              <h3 className="m-0 text-dark fw-bold">
                Tasks for{" "}
                {toLocalDate(selectedDate).toLocaleDateString("en-US", {
                  weekday: "long", month: "long", day: "numeric",
                })}
              </h3>
              <small className="text-muted">
                Showing {filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"}
              </small>
            </div>
            <Form.Group>
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

        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3 text-muted">Loading tasks...</p>
            </div>
          ) : (
            <div className="table-responsive" style={{ maxHeight: "60vh", overflowY: "auto", overflowX: "auto" }}>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light sticky-top">
                    <tr>
                      <th style={{ width: "40px" }}></th>
                      <th>No.</th>
                      <th className="ps-4">Task Title</th>
                      <th>Frequency</th>
                      <th>Schedule</th>
                      <th>Status</th>
                      <th>Created At</th>
                      <th>Completed At</th>
                      <th className="pe-4 text-end">Actions</th>
                    </tr>
                  </thead>
                  {/* ✅ items use String(sheet.status._id) — matches useSortable id */}
                  <SortableContext
                    items={taskList.map((t) => String(t.status._id))}
                    strategy={verticalListSortingStrategy}
                  >
                    <tbody>
                      {taskList.map((sheet, idx) => (
                        <SortableRow
                          key={String(sheet.status._id)}
                          sheet={sheet}
                          idx={idx}
                          handleEdit={handleEdit}
                          handleDeleteClick={handleDeleteClick}
                        />
                      ))}
                    </tbody>
                  </SortableContext>
                </table>
              </DndContext>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4">
          <div className="text-center mb-4">
            <div className="bg-danger bg-opacity-10 d-inline-flex p-3 rounded-circle mb-3">
              <MdDelete size={32} className="text-danger" />
            </div>
            <h5 className="fw-bold mb-2">Delete "{selectedSheet?.task?.title}"?</h5>
            <p className="text-muted">
              This action cannot be undone. All data related to this task will be permanently removed.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="outline-secondary" onClick={() => setShowModal(false)} className="px-4">
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