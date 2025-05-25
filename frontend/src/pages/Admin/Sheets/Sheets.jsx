import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { useApi } from "../../../context/ApiContext";

export default function AdminSheets() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const {deleteTask, fetchTasksForAdmin, tasks} = useApi();

  const [showModal, setShowModal] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState(null);

  console.log(tasks)


  useEffect(() => {
    fetchTasksForAdmin(userId);
  }, []);

  const handleEdit = (task) => {
    navigate("/admin/edit-task", { state: { task } });
  };

  const handleDeleteClick = (task) => {
    setSelectedSheet(task);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      deleteTask(selectedSheet.task._id, userId)
      setShowModal(false);
      setSelectedSheet(null);
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex mb-4">
        <h2 className="">Sheets</h2>
        <a
          href={`/admin/add-task`}
          className="btn btn-primary ms-auto p-2"
        >
          Add Task
        </a>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>Title</th>
              <th>Frequency</th>
              <th>Days / Dates / Date</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Completed at</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((sheet) => (
              <tr
                key={sheet._id}
                className={
                  sheet.status === "completed"
                    ? "table-success text-white"
                    : "table-light"
                }
              >
                <td>{sheet.task.title }</td>
                <td>{sheet.task.frequency}</td>
                <td>
                  {sheet.task.frequency === 'daily' ? (
                    'Everyday'
                  ): (
                    sheet.task.days.length
                    ? sheet.task.days.join(", ")
                    : sheet.task.dates.length
                    ? sheet.task.dates.join(", ")
                    : new Date(sheet.task.date).toLocaleDateString()
                    
                  )}
                </td>
                <td>{sheet.status}</td>
                <td>{new Date(sheet.createdAt).toLocaleString()}</td>
                <td>
                  {sheet.date ? new Date(sheet.date).toLocaleString() : "-"}
                </td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleEdit(sheet.task)}
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDeleteClick(sheet)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
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
