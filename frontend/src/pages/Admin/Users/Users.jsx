import React, {  useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { useApi } from "../../../context/ApiContext";

export default function Users() {
  const {users, deleteUser, fetchUsers} = useApi();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  console.log(users)



  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };




  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      deleteUser(userToDelete._id)
      setUserToDelete(null);
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };





  return (
    <div className="container mt-5">
      <h2 className="mb-4">All Users</h2>
      <div className="row">
        {users.map((user, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">{user.name}</h5>
                <p className="card-text"><strong>Email:</strong> {user.email}</p>
                <p className="card-text"><strong>Branch:</strong> {user.branch ? user.branch.name : 'Branch may be deleted'}</p>
                <p className="card-text"><strong>Phone:</strong> {user.phone_number}</p>
                <p className="card-text"><strong>Address:</strong> {user.address}</p>
                <div className="d-flex justify-content-between">
                  <a className="btn btn-primary" href={`/admin/users/sheets/${user._id}`}>
                    View Sheet
                  </a>
                  <button className="btn btn-danger" onClick={() => confirmDelete(user)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{userToDelete?.name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
