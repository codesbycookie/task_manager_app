import React, { useState, useEffect } from 'react';
import { useApi } from '../../../context/ApiContext';

export default function EditTask({ taskData, closeModal, userId }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '',
    deadline: '',
  });

  const { update_task } = useApi();

  useEffect(() => {
    if (taskData) {
      setFormData({
        title: taskData.title || '',
        description: taskData.description || '',
        priority: taskData.priority || 'Medium',
        deadline: taskData.deadline ? taskData.deadline.split('T')[0] : '',
      });
    }
  }, [taskData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await update_task({ taskId: taskData._id, task: {...formData}, userId });
      closeModal();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="form-control"
          rows="3"
          required
        ></textarea>
      </div>

      <div className="mb-3">
        <label className="form-label">Priority</label>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="form-select"
          required
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Deadline</label>
        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>

      <div className="d-flex justify-content-end">
        <button type="button" className="btn btn-secondary me-2" onClick={closeModal}>
          Cancel
        </button>
        <button type="submit" className="btn btn-success">
          Update Task
        </button>
      </div>
    </form>
  );
}
