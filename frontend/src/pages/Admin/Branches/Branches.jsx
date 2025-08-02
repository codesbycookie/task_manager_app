import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Badge, Spinner } from 'react-bootstrap';
import { useApi } from '../../../context/ApiContext';
import { FaBuilding, FaEdit, FaTrash, FaPlus, FaUsers, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

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
    <div className="container py-4 ms-0">
      {/* Header Section */}
      <div className="d-flex flex-column flex-md-row align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center mb-3 mb-md-0">
          <FaBuilding className=" me-3" size={28} style={{color: '#8dc540'}} />
          <h2 className="m-0">Branches</h2>
        </div>
        <a 
          href="/admin/add-branch" 
          className="btn d-flex align-items-center px-3 px-md-4 py-2 text-white"
          style={{backgroundColor: '#8dc540'}}
        >
          <FaPlus className="me-2" />
          Add Branch
        </a>
      </div>

      {/* Branches Grid */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {branches.map((branch) => (
          <div className="col" key={branch._id}>
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h5 className="card-title mb-0 text-truncate">{branch.name}</h5>
                  <Badge bg="light" text="dark" className="border">
                    {branch.members_count} <FaUsers className="ms-1" />
                  </Badge>
                </div>
                
                <div className="mb-3 flex-grow-1">
                  <p className="mb-2">
                    <FaMapMarkerAlt className="text-muted me-2" />
                    <strong>Address:</strong> {branch.address}
                  </p>
                  <p className="mb-2">
                    <FaPhone className="text-muted me-2" />
                    <strong>Phone:</strong> {branch.phone_number}
                  </p>
                </div>
                
                <div className="mt-auto">
                  <p className="text-muted small mb-2">
                    Updated: {new Date(branch.updatedAt).toLocaleString()}
                  </p>
                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      variant=""
                      size="sm"
                      onClick={() => navigate('/admin/edit-branch', { state: { branch } })}
                      className="d-flex align-items-center text-white"
                    >
                      <FaEdit className="me-1" />
                      Edit
                    </Button>
                    <Button
                      variant=""
                      size="sm"
                      onClick={() => {
                        setSelectedBranch(branch);
                        setShowDeleteModal(true);
                      }}
                      className="d-flex align-items-center bg-danger text-white"
                    >
                      <FaTrash className="me-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4">
          <div className="text-center mb-3">
            <div className="bg-danger bg-opacity-10 d-inline-flex p-3 rounded-circle mb-3">
              <FaTrash size={32} className="text-danger" />
            </div>
            <p>Are you sure you want to delete <strong className="text-primary">"{selectedBranch?.name}"</strong>?</p>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowDeleteModal(false)}
            className="px-4 text-white"
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDelete} 
            disabled={deleting}
            className="px-4 d-flex align-items-center bg-danger text-white"
          >
            {deleting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}