import React, { useState } from 'react';
import { useApi } from '../../../context/ApiContext';

export default function AddTask({ selectedDate, userId, closeModal }) {
  const [formData, setFormData] = useState({
    userId: userId,
    title: '',
    description: '',
    priority: 'Medium',
    deadline: selectedDate || '',
  });

  const {assign_task} = useApi();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      assign_task(formData);  
      closeModal();
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Error adding task');
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
        <button type="submit" className="btn btn-primary">
          Add Task
        </button>
      </div>
    </form>
  );
}
