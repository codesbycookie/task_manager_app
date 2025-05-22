/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../../context/ApiContext";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import EditUser from "../EditUser/EditUser";

export default function Users() {
  const [editTaskShow, setEditTaskShow] = useState(false);
  const [deleteTaskShow, setDeleteTaskShow] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const navigate = useNavigate();
  const { users, delete_user } = useApi();

  const handleCardClick = (userId) => {
    navigate(`/admin/users/sheets/${userId}`);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditTaskShow(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteTaskShow(true);
  };

  const handleDeleteUser = (id) => {
    try {
      delete_user(id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">👥 All Users</h3>

      <div className="row">
        {users.map((user) => (
          <div
            className="col-md-4 mb-4"
            key={user._id}
            style={{ cursor: "pointer" }}
          >
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="card-title">{user.name}</h5>
                  <div className="dropdown">
                    <a
                      className="btn btn-secondary dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      click
                    </a>

                    <ul className="dropdown-menu">
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleEditClick(user)}
                        >
                          Edit User
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleDeleteClick(user)}
                        >
                          Delete User
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
                <h6 className="card-subtitle mb-2 mt-3 text-muted">
                  {user.email}
                </h6>
                <p className="card-text">
                  <strong>UID:</strong> {user.uid} <br />
                  <strong>Branch:</strong> {user.branch}
                </p>
                <button onClick={() => handleCardClick(user._id)}>
                  View Sheet
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit User Modal */}
      <Modal show={editTaskShow} onHide={() => setEditTaskShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Replace below with your edit form */}
          <EditUser userData={selectedUser} closeModal={() => setEditTaskShow(false)} />
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditTaskShow(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              /* Your edit logic here */
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete User Modal */}
      <Modal show={deleteTaskShow} onHide={() => setDeleteTaskShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{selectedUser?.name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteTaskShow(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDeleteUser(selectedUser._id)}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
