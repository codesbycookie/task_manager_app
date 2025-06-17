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
      date: new Date(),
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
        task: taskId,
        user: userId,
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
    const { taskStatusId } = req.params;

    console.log(taskStatusId)

    const deletedTaskStatus = await TaskStatus.findByIdAndDelete(taskStatusId).populate('task');


    const task = await Task.findById(deletedTaskStatus.task._id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.users_assigned = task.users_assigned.filter(userId => userId.toString() !== deletedTaskStatus.user.toString());

    await task.save();
    
    if (!deletedTaskStatus) {
      return res.status(404).json({ message: "Task not found" });
    }


    res.status(200).json({
      message: "Task deleted successfully",
      task: deletedTaskStatus.task,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};


const getTaskByUserId2 = async (req, res) => {
  try {
    const { userId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const weekdayNames = [
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];
    const selectedWeekday = weekdayNames[selectedDate.getDay()];
    const selectedDay = selectedDate.getDate();

    const tasks = await Task.find({ users_assigned: userId });

    const filteredTasks = tasks.filter((task) => {
      if (task.frequency === "daily") return true;

      if (task.frequency === "weekly" && task.days?.includes(selectedWeekday)) return true;

      if (task.frequency === "monthly" && task.dates?.includes(selectedDay)) return true;

      if (task.frequency === "once" && task.date) {
        const taskDate = new Date(task.date);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === selectedDate.getTime();
      }

      return false;
    });

    if (!filteredTasks || filteredTasks.length === 0) {
      return res.status(404).json({ message: "No applicable tasks for this date" });
    }

    // 3. Fetch TaskStatus entries for this date
    const taskStatusOnDate = await TaskStatus.find({
      user: userId,
      date: selectedDate,
    }).populate('task').populate('user');

    // 4. Build final response
    const tasksWithStatus = filteredTasks.map(task => {
      const status = taskStatusOnDate.find(
        (s) => s.task._id.toString() === task._id.toString()
      );

      let computedStatus = "not completed";
      if (status?.completed) computedStatus = "completed";
      else if (selectedDate < now) computedStatus = "missed";

      return {
        task,
        taskStatus: status || null,
        status: computedStatus,
      };
    });

    res.status(200).json({
      message: "Tasks retrieved successfully",
      tasks: tasksWithStatus,
    });

  } catch (err) {
    console.error("Error in getTaskByUserId:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};






const getTaskByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const statuses = await TaskStatus.find({ user: userId }).populate('task').populate('user');


    console.log(statuses)

    res.status(200).json({ tasks: statuses });

  } catch (err) {
    console.error("Error in getTaskByUserId:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

const fetchTaskStatusForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    const today = new Date(); // you can also test with new Date("2025-06-18T00:00:00Z")
    today.setHours(0, 0, 0, 0);

    const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
    const dayNumber = today.getDate();

    // Fetch task statuses for ONLY the selected date (not all)
    const startOfDay = new Date(today);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const taskStatuses = await TaskStatus.find({
      user: userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    }).populate("task").populate("user");

    // Build a map to find completed statuses quickly
    const statusMap = new Map();
    for (const sheet of taskStatuses) {
      statusMap.set(sheet.task._id.toString(), sheet.status);
    }

    // Fetch all tasks assigned to this user (assuming you're doing this in your app)
    const allTasks = await Task.find({ users_assigned: userId });

    // Filter tasks that match today's frequency
    const filtered = allTasks
      .filter((task) => {
        const frequency = task.frequency;
        const taskDate = task.date ? new Date(task.date) : null;
        taskDate?.setHours(0, 0, 0, 0);

        return (
          frequency === "daily" ||
          (frequency === "weekly" && task.days?.includes(dayName)) ||
          (frequency === "monthly" && task.dates?.includes(dayNumber)) ||
          (frequency === "once" && taskDate?.getTime() === today.getTime())
        );
      })
      .map((task) => {
        const status = statusMap.get(task._id.toString()) || "not completed";
        return {
          task,
          status,
          date: today.toISOString().split("T")[0],
        };
      });

    res.status(200).json({ tasks: filtered });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};






const submitTask = async (req, res) => {
  try {
    const { userId, taskId, taskStatusId, date } = req.body;

    if (!userId || !taskId || !date) {
      return res.status(400).json({ message: 'userId, taskId, and date are required.' });
    }

    const assignedDate = new Date(date);
    assignedDate.setHours(0, 0, 0, 0);

    if (taskStatusId) {
      // ✅ Update existing task status
      const existingStatus = await TaskStatus.findById(taskStatusId);
      if (!existingStatus) {
        return res.status(404).json({ message: 'TaskStatus not found.' });
      }

      existingStatus.status = 'completed';
      existingStatus.completedAt = new Date(); // Mark current time of submission
      await existingStatus.save();

      return res.status(200).json({ success: true, message: 'Task marked as completed.', taskStatus: existingStatus });
    }

    // ✅ Check if a status for this user + task + assigned date already exists
    const alreadyExists = await TaskStatus.findOne({
      user: userId,
      task: taskId,
      date: {
        $gte: assignedDate,
        $lt: new Date(assignedDate.getTime() + 24 * 60 * 60 * 1000), // next midnight
      },
    });

    if (alreadyExists) {
      return res.status(409).json({ message: 'Task already marked for this date.' });
    }

    // ✅ Create new status entry
    const newStatus = new TaskStatus({
      user: userId,
      task: taskId,
      date: assignedDate,               // which day it was assigned
      completedAt: new Date(),          // when user completed it
      status: 'completed',
    });

    await newStatus.save();

    res.status(201).json({ success: true, message: 'Task submitted successfully.', taskStatus: newStatus });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



module.exports = {
  addTask,
  editTask,
  deleteTask,
  getTaskByUserId,
  submitTask,
  fetchTaskStatusForUser,
  
};