import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../../context/ApiContext';

export default function Branches() {

  const {branches, deleteBranch} = useApi();

  const [selectedBranch, setSelectedBranch] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();


  const handleDelete = async () => {
    try {
      console.log('Deleting branch:', selectedBranch._id);
      deleteBranch(selectedBranch._id);
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Error deleting branch:', err);
    }
  };


  return (
    <div className="container mt-5">
      <div className="d-flex mb-4">
        <h2 className="">Branches</h2>
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
                <p className="card-text"><strong>Address:</strong> {branch.address}</p>
                <p className="card-text"><strong>Phone:</strong> {branch.phone_number}</p>
                <p className="card-text"><strong>Members:</strong> {branch.members_count}</p>
                <p className="card-text text-muted">
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

      {/* Delete Modal */}
      {showDeleteModal && selectedBranch && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete <strong>{selectedBranch.name}</strong>?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
