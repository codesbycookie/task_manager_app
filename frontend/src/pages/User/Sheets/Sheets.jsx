import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useApi } from '../../../context/ApiContext';
import { Modal, Button } from 'react-bootstrap';

export default function UserSheets() {
  const {fetchTasksForUser, userTasks, submitTask, loading, user } = useApi();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);


  // console.log("UserTasks:", userTasks);



  const handleCheckboxClick = (taskId, statusId) => {
    setSelectedTask(taskId);
    setSelectedStatus(statusId);
    setShowConfirmation(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmation(false);
    try {
      await submitTask(selectedTask, selectedStatus);
    } catch (error) {
      console.error('Error submitting task:', error);
    }
  };

  const handleCancelSubmit = () => {
    setShowConfirmation(false);
    setSelectedTask(null);
    setSelectedStatus(null);
  };

  return (
    <div className="container my-4">
      {/* Confirmation Modal */}
      <Modal show={showConfirmation} onHide={handleCancelSubmit} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Completion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to mark this task as completed?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelSubmit}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={handleConfirmSubmit}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Rest of the component remains the same with small adjustment to checkbox handling */}
      <div className="d-flex flex-column flex-md-row align-items-center justify-content-between mb-4">
        <h3 className="mb-3 mb-md-0 fw-bold" style={{color: '#8dc540'}}>Your Today's Task Sheet</h3>
        <button 
          className="btn btn-primary px-4 py-2 shadow-sm" 
          onClick={() => fetchTasksForUser(user._id)} 
          disabled={loading}
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          ) : (
            <i className="bi bi-arrow-clockwise me-2"></i>
          )}
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center my-5 py-5">
          <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading your tasks...</p>
        </div>
      ) : userTasks.length === 0 ? (
        <div className="alert alert-info text-center py-3 shadow-sm">
          <i className="bi bi-info-circle-fill me-2"></i>
          No tasks for today!
        </div>
      ) : (
        <div className="card border-0 shadow-sm overflow-hidden">
          <div className="table-responsive" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light sticky-top">
                <tr>
                  <th style={{ width: '5%', minWidth: '50px' }} className="bg-light">S No.</th>
                  <th style={{ width: '25%', minWidth: '200px' }} className="bg-light">Task</th>
                  <th style={{ width: '25%', minWidth: '200px' }} className="bg-light">Created At</th>
                  <th style={{ width: '25%', minWidth: '200px' }} className="bg-light">Submitted At</th>
                  <th style={{ width: '20%', minWidth: '150px' }} className="text-center bg-light">Status</th>
                </tr>
              </thead>
              <tbody>
                {userTasks.map((item, index) => {
                  const { task, completedAt, status } = item;
                  const isCompleted = status.status === 'completed';
                  const isMissed = status.status === 'missed';

                  return (
                    <tr 
                      key={task._id + index} 
                      className={isCompleted ? 'bg-success bg-opacity-10' : isMissed ? 'bg-danger bg-opacity-10' : ''}
                    >
                      <td className="fw-semibold">{index + 1}.</td>
                      <td className={isCompleted ? 'text-decoration-line-through text-muted' : ''}>
                        {task.title}
                      </td>
                      <td>
                        {task.createdAt
                          ? new Date(task.createdAt).toLocaleString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'N/A'}
                      </td>
                      <td>
                        {completedAt
                          ? new Date(completedAt).toLocaleString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Not yet submitted'}
                      </td>
                      <td className="text-center">
                        <div className="form-check d-inline-block">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={isCompleted}
                            onChange={() => handleCheckboxClick(task._id, status._id)}
                            style={{ 
                              cursor: isMissed ? 'not-allowed' : 'pointer',
                              width: '1.2em',
                              height: '1.2em'
                            }}
                            disabled={isCompleted || isMissed || loading}
                          />
                          <span className="ms-2 small">
                            {isCompleted ? 'Done' : isMissed ? 'Missed' : 'Pending'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}