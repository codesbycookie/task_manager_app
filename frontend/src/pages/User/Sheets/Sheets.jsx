import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../Navbar/Navbar';
import { getRequest, postRequest } from '../../../utils/ApiService';
import { useApi } from '../../../context/ApiContext';


export default  function UserSheets () {

  const {user} = useApi();

  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false);


  const fetchTasks = async () => {
      try {
        const response = await getRequest(`http://localhost:3000/api/tasks/fetch-tasks-for-user/${user._id}`);
        console.log(response)
        setTasks(response.tasks)
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

  useEffect(() => {
    fetchTasks();
  } , []);
      console.log(user)


  const handleSubmitTask = async(e, taskId, taskStatusId) => {
    e.preventDefault();
    try {
      setLoading(true)
      const response = await postRequest('http://localhost:3000/api/tasks/submit-task', {userId: user._id ,taskId: taskId, date: new Date(), taskStatusId: taskStatusId });
    console.log(response)
    fetchTasks()
    } catch (error) {
      console.error('Error creating task:', error);
    }finally {
      setLoading(false)
    }
  }


  return (
    <>
    <div className="container my-4">
      <div className="d-flex">
              <h3 className="mb-4">Your Today's Task Sheet</h3>
              <div className="ms-auto">
                <button className="btn btn-primary" onClick={fetchTasks}>
                  Refresh
                </button></div>
      </div>
 {loading ? (
            'Loading....'
          ) : (
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th style={{ width: '10%' }}>#</th>
            <th style={{ width: '40%' }}>Task</th>
                        <th style={{ width: '30%' }}>Submited at</th>

            <th style={{ width: '20%' }}>Completed</th>
          </tr>
        </thead>
        <tbody>
         
            {tasks.map((task, index) => (
            <tr key={task._id}>
              <td>{index + 1}</td>
              <td
                className={task.completed ? 'text-decoration-line-through text-muted' : ''}
              >
                {task.task.title}
              </td>
              <td>
                {task.date ? new Date(task.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                }): ('Not yet submitted')}
              </td>
              <td className="text-center">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={task.status === 'completed'}
                  onChange={(e) => {handleSubmitTask(e, task.task._id, task._id)}}
                  disabled={task.status === 'completed' || loading}
                />
              </td>
            </tr>
          ))}
         
        </tbody>
      </table>
       )}
    </div>
    </>
  );
};

