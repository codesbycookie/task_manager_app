import React, { useState, useEffect } from "react";
import { Modal, Button, Badge, Spinner, Form } from "react-bootstrap";
import { useApi } from "../../../context/ApiContext";
import { FaUser, FaTrash, FaEye, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBuilding, FaSignInAlt, FaFilter } from "react-icons/fa";

export default function Users() {
  const { users, deleteUser } = useApi();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [branchFilter, setBranchFilter] = useState("all");
  const [uniqueBranches, setUniqueBranches] = useState([]);

  useEffect(() => {
    // Extract unique branches from users
    const branches = [...new Set(users.map(user => 
      user.branch ? user.branch._id : null
    ).filter(branchId => branchId !== null))];
    
    // Get branch details for each unique branch
    const branchDetails = branches.map(branchId => {
      const userWithBranch = users.find(user => user.branch?._id === branchId);
      return userWithBranch ? userWithBranch.branch : null;
    }).filter(branch => branch !== null);

    setUniqueBranches(branchDetails);
  }, [users]);

  const filteredUsers = branchFilter === "all" 
    ? users 
    : users.filter(user => user.branch?._id === branchFilter);

  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      await deleteUser(userToDelete._id);
      setUserToDelete(null);
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Failed to delete user:", err);
    } finally {
      setDeleting(false);
    }
  };

  const formatDateTime = (date) => {
    if (!date) return "Not Yet Logged In";
    return new Date(date).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="fw-bold d-flex align-items-center justify-content-center" style={{color: '#8dc540'}}>
          <FaUser className="me-3" />
          User Management
        </h2>
      </div>

      {/* Filter Section */}
      <div className="row mb-4">
        <div className="col-md-6 mx-auto">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <Form.Group className="mb-0">
                <div className="d-flex align-items-center">
                  <FaFilter className="me-2 text-muted" />
                  <Form.Label className="mb-0 me-2 fw-bold">Filter by Branch:</Form.Label>
                  <Form.Select
                    value={branchFilter}
                    onChange={(e) => setBranchFilter(e.target.value)}
                    className="shadow-sm"
                  >
                    <option value="all">All Branches</option>
                    {uniqueBranches.map((branch) => (
                      <option key={branch._id} value={branch._id}>
                        {branch.name}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </Form.Group>
            </div>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {filteredUsers.map((user, index) => (
          <div className="col" key={index}>
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h5 className="card-title mb-0">{user.name}</h5>
                  <Badge bg="light" text="dark" className="border">
                    ID: {user._id.substring(18, 24)}
                  </Badge>
                </div>

                <div className="mb-3 flex-grow-1">
                  <div className="d-flex align-items-start mb-2">
                    <FaEnvelope className="text-muted mt-1 me-2" />
                    <div>
                      <small className="text-muted d-block">Email</small>
                      <p className="mb-0">{user.email}</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start mb-2">
                    <FaBuilding className="text-muted mt-1 me-2" />
                    <div>
                      <small className="text-muted d-block">Branch</small>
                      <p className="mb-0">
                        {user.branch ? user.branch.name : "Branch may be deleted"}
                      </p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start mb-2">
                    <FaPhone className="text-muted mt-1 me-2" />
                    <div>
                      <small className="text-muted d-block">Phone</small>
                      <p className="mb-0">{user.phone_number}</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start mb-2">
                    <FaMapMarkerAlt className="text-muted mt-1 me-2" />
                    <div>
                      <small className="text-muted d-block">Address</small>
                      <p className="mb-0">{user.address}</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start">
                    <FaSignInAlt className="text-muted mt-1 me-2" />
                    <div>
                      <small className="text-muted d-block">Last Login</small>
                      <p className="mb-0">{formatDateTime(user.last_login)}</p>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-between mt-auto">
                  <a
                    className="btn btn-sm d-flex align-items-center"
                    href={`/admin/users/sheets/${user._id}`}
                    style={{backgroundColor: '#8dc540', color: 'white'}}
                  >
                    <FaEye className="me-1" />
                    View Sheet
                  </a>
                  <button
                    className="btn btn-sm d-flex align-items-center text-white bg-danger"
                    onClick={() => confirmDelete(user)}
                    
                  >
                    <FaTrash className="me-1" />
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
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4">
          <div className="text-center mb-3">
            <div className="bg-danger bg-opacity-10 d-inline-flex p-3 rounded-circle mb-3">
              <FaTrash size={32} className="text-danger" />
            </div>
            <p>
              Are you sure you want to delete user <strong className="text-primary">"{userToDelete?.name}"</strong>?
            </p>
            <p className="text-muted small">
              This action cannot be undone. All user data will be permanently removed.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0">
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
              'Delete User'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}