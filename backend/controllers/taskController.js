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
      dates = [],
      users_assigned = [],
      branch = null,
    } = req.body;

    // Frequency validation
    const allowedFrequencies = ["once", "daily", "weekly", "monthly"];
    if (!allowedFrequencies.includes(frequency)) {
      return res.status(400).json({ message: "Invalid frequency type." });
    }

    // For 'once', date is required
    if (frequency === "once" && !date) {
      return res.status(400).json({ message: "Date is required for once tasks." });
    }

    // For 'monthly', dates[] is required
    if (frequency === "monthly" && (!dates || dates.length === 0)) {
      return res.status(400).json({ message: "Dates are required for monthly tasks." });
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
      dates,
      date,
      users_assigned,
      branch,
    });

    await task.save();

    const normalizeDate = (date) => {
      const d = date ? new Date(date) : new Date();
      d.setHours(0, 0, 0, 0);
      return d;
    }

    const taskStatusEntries = users_assigned.map(userId => ({
      user: userId,
      task: task._id,
      status: 'not completed',
    }));

    await TaskStatus.insertMany(taskStatusEntries);



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

    // Adjust frequency-related fields
    if (updateData.frequency === "once") {
      updateData.days = [];
      updateData.dates = [];
    } else if (updateData.frequency === "weekly") {
      updateData.date = null;
      updateData.dates = [];
    } else if (updateData.frequency === "monthly") {
      updateData.date = null;
      updateData.days = [];
    }

    // Update the task
    const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Sync task status for updated users_assigned
    if (updateData.users_assigned && Array.isArray(updateData.users_assigned)) {
      // Delete all old statuses
      await TaskStatus.deleteMany({ task: taskId });

      // Create new statuses
      const newStatuses = updateData.users_assigned.map(userId => ({
        task:taskId,
        user:userId,
        status: 'not completed', // default status
      }));

      await TaskStatus.insertMany(newStatuses);
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



const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    console.log(taskId)

    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    await TaskStatus.deleteMany({task: taskId})

    res.status(200).json({
      message: "Task deleted successfully",
      task: deletedTask,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

const getTaskByUserId = async (req, res) => {
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


const fetchTaskStatusForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate input
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const tasksWithStatus = await TaskStatus.find({ user: userId })
      .populate('task').populate('user')
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, tasks: tasksWithStatus });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};



const submitTask = async (req, res) => {
  const { userId, taskId, date, taskStatusId } = req.body;
  console.log(userId, taskId, date, taskStatusId, "submmiting task")
  try {
    const taskStatus = await TaskStatus.findById(taskStatusId);
    if (!taskStatus) {
      return res.status(404).json({ message: 'Task status not found' });
    }
    taskStatus.status = 'completed';
    taskStatus.date = date ? new Date(date) : new Date();
    await taskStatus.save();

    res.status(200).json({
      success: true,
      message: 'Task marked as completed',
      taskStatus
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Already submitted for this date' });
    }
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
  submitTask,
  fetchTaskStatusForUser
};