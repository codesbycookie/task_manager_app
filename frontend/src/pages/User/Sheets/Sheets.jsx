import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getRequest, postRequest } from '../../../utils/ApiService';
import { useApi } from '../../../context/ApiContext';
import {toast} from 'react-toastify'

export default function UserSheets() {
  const { user } = useApi();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    if (!user?._id) return;
    try {
      setLoading(true);
      const response = await getRequest(`http://localhost:3000/api/tasks/fetch-tasks-for-user/${user._id}`);
      setTasks(response.tasks || []);
      console.log('user todays tasks', response.tasks)
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) fetchTasks();
  }, []);

  const handleSubmitTask = async (e, taskId, taskStatusId) => {
    e.preventDefault();
    try {
      setLoading(true);
      await postRequest('http://localhost:3000/api/tasks/submit-task', {
        userId: user._id,
        taskId: taskId,
        taskStatusId: taskStatusId,
        date: new Date(),
      });
      fetchTasks();
      
    } catch (error) {
      console.error('Error submitting task:', error);
      toast.error(error.message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <div className="d-flex align-items-center mb-3">
        <h3 className="mb-0">Your Today's Task Sheet</h3>
        <button className="btn btn-primary ms-auto" onClick={fetchTasks}>
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : tasks.length === 0 ? (
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
            {tasks.map((task, index) => (
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
