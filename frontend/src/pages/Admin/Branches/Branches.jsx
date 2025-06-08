import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { useApi } from '../../../context/ApiContext';
import './Branches.css'

export default function Branches() {
  const { branches, deleteBranch } = useApi();
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!selectedBranch) return;
    setDeleting(true);
    try {
      await deleteBranch(selectedBranch._id);
      setShowDeleteModal(false);
      setSelectedBranch(null);
    } catch (err) {
      console.error('Error deleting branch:', err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex mb-4">
        <h2>Branches</h2>
        <a href={`/admin/add-branch`} className="btn btn-primary ms-auto p-2">
          Add Branch
        </a>
      </div>

      <div className="row">
        {branches.map((branch) => (
          <div className="col-md-4 mb-4" key={branch._id}>
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">{branch.name}</h5>
                <p><strong>Address:</strong> {branch.address}</p>
                <p><strong>Phone:</strong> {branch.phone_number}</p>
                <p><strong>Members:</strong> {branch.members_count}</p>
                <p className="text-muted">
                  <small>Updated: {new Date(branch.updatedAt).toLocaleString()}</small>
                </p>
                <div className="d-flex justify-content-end gap-2 mt-3">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => navigate('/admin/edit-branch', { state: { branch } })}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => {
                      setSelectedBranch(branch);
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* React-Bootstrap Modal for delete confirmation */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{selectedBranch?.name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
