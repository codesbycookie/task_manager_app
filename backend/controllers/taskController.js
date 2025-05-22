const verifyTask = require('../middlewares/verifyTask');
const verifyAdmin = require('../middlewares/verifyAdmin');
const verifyUser = require('../middlewares/verifyUser');
const verifyBranch = require('../middlewares/verifyBranch');

const Admin = require('../models/admin');
const User = require('../models/user')
const Task = require('../models/task')
const TaskStatus = require('../models/taskStatus');

const addTask = async (req, res) => {
  try {
    const {
      title,
      description,
      frequency,
      days = [],
      date = null,
      users_assigned = [],
      branch = null,
    } = req.body;

    // Frequency validation
    const allowedFrequencies = ["once", "daily", "weekly", "monthly"];
    if (!allowedFrequencies.includes(frequency)) {
      return res.status(400).json({ message: "Invalid frequency type." });
    }

    // For 'once' or 'monthly', 'date' is required
    if ((frequency === "once" || frequency === "monthly") && !date) {
      return res.status(400).json({ message: "Date is required for once/monthly tasks." });
    }

    // For 'weekly', days[] is required
    if (frequency === "weekly" && (!days || days.length === 0)) {
      return res.status(400).json({ message: "Days are required for weekly tasks." });
    }

    const task = new Task({
      title,
      description,
      frequency,
      days,
      date,
      users_assigned,
      branch,
    });

    await task.save();

    res.status(201).json({
      message: "Task created successfully",
      task,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

const editTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const updateData = req.body;

    const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

const deleteTask =  async (req, res) => {
  try {
    const { taskId } = req.params;

    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({
      message: "Task deleted successfully",
      task: deletedTask,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

const getTaskByUserId =async (req, res) => {
  try {
    const { userId } = req.params;
    const tasks = await Task.find({ users_assigned: userId })

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found for this user" });
    }

    res.status(200).json({
      message: "Tasks retrieved successfully",
      tasks: tasks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

const submitTask = async (req, res) => {
  const { userId, taskId, date } = req.body;

  try {
    // Try to find if the status already exists for that task and date
    let taskStatus = await TaskStatus.findOne({ user: userId, task: taskId, date });

    if (taskStatus) {
      // Update if it already exists
      taskStatus.status = 'completed';
      await taskStatus.save();
    } else {
      // Create new entry
      taskStatus = new TaskStatus({
        user: userId,
        task: taskId,
        date,
        status: 'completed'
      });
      await taskStatus.save();
    }

    res.status(200).json({
      success: true,
      message: 'Task marked as completed',
      taskStatus
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit task',
      error: err.message
    });
  }
};

module.exports = {
  addTask,
  editTask,
  deleteTask,
  getTaskByUserId,
  submitTask
};