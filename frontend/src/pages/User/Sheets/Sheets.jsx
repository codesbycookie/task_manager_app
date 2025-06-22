import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useApi } from '../../../context/ApiContext';

export default function UserSheets() {
  const { user, fetchTasksForUser, userTasks, submitTask, loading } = useApi();


  useEffect(() => {
    if (user?._id) fetchTasksForUser(user?._id);
  }, [user._id]);

  const handleSubmitTask = async (e, taskId, taskStatusId) => {
    e.preventDefault();
    try {
      console.log('Submitting task:', taskId, taskStatusId);
      submitTask(taskId, taskStatusId);
    } catch (error) {
      console.error('Error submitting task:', error);
    }
  };

  console.log('User Tasks:', userTasks);

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
           {userTasks.map((item, index) => {
  const { task, completedAt, status } = item;

  return (
    <tr key={task._id} className={status.status === 'completed' ? 'table-success' : status.status === 'missed' ? 'table-danger' : 'table-light'}>
      <td>{index + 1}</td>
      <td className={status.status === 'completed' ? 'text-decoration-line-through text-muted' : ''}>
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
<input
  type="checkbox"
  className="form-check-input"
  checked={status.status === 'completed'}
  onChange={(e) => handleSubmitTask(e, task._id, status._id)}
  style={{ cursor: status.status === 'missed' ? 'not-allowed':'pointer' }}
  disabled={status.status === 'completed' || status.status  === 'missed'  || loading}
/>


      </td>
    </tr>
  );
})}

          </tbody>
        </table>
      )}
    </div>
  );
}
