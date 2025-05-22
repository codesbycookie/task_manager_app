import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../Components/Navbar/Navbar';

const Sheets = () => {
  const dummyTasks = [
    { id: 1, title: 'Design homepage UI', completed: false },
    { id: 2, title: 'Fix login bug', completed: true },
    { id: 3, title: 'Write documentation', completed: false },
  ];

  return (
    <>
    <Navbar/>
    <div className="container my-4">
      <h3 className="mb-4">Your Task Sheet</h3>

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th style={{ width: '10%' }}>#</th>
            <th style={{ width: '70%' }}>Task</th>
            <th style={{ width: '20%' }}>Completed</th>
          </tr>
        </thead>
        <tbody>
          {dummyTasks.map((task, index) => (
            <tr key={task.id}>
              <td>{index + 1}</td>
              <td
                className={task.completed ? 'text-decoration-line-through text-muted' : ''}
              >
                {task.title}
              </td>
              <td className="text-center">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={task.completed}
                  onChange={() => {}}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default Sheets;
