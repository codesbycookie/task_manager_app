import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useApi } from '../../../context/ApiContext';

export default function UserSheets() {
  const { user, fetchTasksForUser, userTasks, submitTask, loading } = useApi();


  useEffect(() => {
    if (user?._id) fetchTasksForUser(user?._id);
  }, []);

  const handleSubmitTask = async (e, taskId, taskStatusId) => {
    e.preventDefault();
    try {
      submitTask(taskId, taskStatusId);
    } catch (error) {
      console.error('Error submitting task:', error);
    }
  };

  return (
    <div className="container my-4">
      <div className="d-flex align-items-center mb-3">
        <h3 className="mb-0">Your Today's Task Sheet</h3>
        <button className="btn btn-primary ms-auto" onClick={fetchTasksForUser} disabled={loading}>
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : userTasks.length === 0 ? (
        <div className="alert alert-info text-center">No tasks for today!</div>
      ) : (
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th style={{ width: '20%' }}>#</th>
              <th style={{ width: '20%' }}>Task</th>
                            <th style={{ width: '20%' }}>Created At</th>

              <th style={{ width: '20%' }}>Submitted At</th>
              <th style={{ width: '20%' }}>Completed</th>
            </tr>
          </thead>
          <tbody>
            {userTasks.map((task, index) => (
              <tr key={task._id}>
                <td>{index + 1}</td>
                <td
                  className={task.status === 'completed' ? 'text-decoration-line-through text-muted' : ''}
                >
                  {task.task.title}
                </td>
                  <td>
                  {task.task.createdAt
                    ? new Date(task.task.createdAt).toLocaleString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Not yet submitted'}
                </td>
                <td>
                  {task.submittedAt
                    ? new Date(task.submittedAt).toLocaleString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Not yet submitted'}
                </td>
              
                <td className="text-center">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={task.status === 'completed'}
                    onChange={(e) => handleSubmitTask(e, task.task._id, task._id)}
                    disabled={task.status === 'completed' || loading}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
