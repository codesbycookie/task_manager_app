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

        const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    const statuses = await TaskStatus.find({ user: userId }).populate('task').populate('user');



    console.log({statuses, user})

    res.status(200).json({ tasks: statuses, user: user });

  } catch (err) {
    console.error("Error in getTaskByUserId:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

const fetchTaskStatusForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
    const dayNumber = today.getDate();

    console.log({ dayName, dayNumber, today: today.toLocaleDateString() });

    // Define start and end of today
    const startOfDay = new Date(today);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch today's statuses for user
    const taskStatuses = await TaskStatus.find({
      user: userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    }).populate("task").populate('user');

    // Map for fast lookup
    const statusMap = new Map();
    for (const s of taskStatuses) {
      statusMap.set(s.task._id.toString(), s);
    }

    // Fetch all tasks assigned to the user
    const allTasks = await Task.find({ users_assigned: userId });

    const filteredTasks = [];

    for (const task of allTasks) {
      const frequency = task.frequency;
      const taskDate = task.date ? new Date(task.date) : null;
      taskDate?.setHours(0, 0, 0, 0);

      const isDueToday =
        frequency === "daily" ||
        (frequency === "weekly" && task.days?.includes(dayName)) ||
        (frequency === "monthly" && task.dates?.includes(dayNumber)) ||
        (frequency === "once" && taskDate?.toLocaleDateString() === today.toLocaleDateString());

      if (!isDueToday) continue;

      let status = statusMap.get(task._id.toString());

      // If not already created, create TaskStatus with 'not completed'
      if (!status) {
        status = await TaskStatus.create({
          user: userId,
          task: task._id,
          date: today,
          status: "not completed",
        });
      }

      filteredTasks.push({
        task,
        status: status,
        completedAt: status.completedAt || null,
        date: today,
      });
    }

    res.status(200).json({ tasks: filteredTasks });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};






const submitTask = async (req, res) => {
  try {
    const { userId, taskId, taskStatusId, date } = req.body;

    console.log({ userId, taskId, taskStatusId, date });

    if (!userId || !taskId || !date) {
      return res.status(400).json({ message: 'userId, taskId, and date are required.' });
    }

    const assignedDate = new Date(date);

    if (taskStatusId) {
      const existingStatus = await TaskStatus.findById(taskStatusId);
      if (!existingStatus) {
        return res.status(404).json({ message: 'TaskStatus not found.' });
      }

      const existingDate = new Date(existingStatus.date);
      existingDate.setHours(0, 0, 0, 0);

      if (existingDate.toLocaleDateString() !== assignedDate.toLocaleDateString()) {
        return res.status(400).json({ message: 'You can only submit for the assigned date.' });
      }

      // ✅ Only allow updating if it's 'not completed' or 'missed'
      if (existingStatus.status === 'completed') {
        return res.status(409).json({ message: 'Task is already marked as completed.' });
      }

      if (existingStatus.status === 'not completed' || existingStatus.status === 'missed') {
        existingStatus.status = 'completed';
        existingStatus.completedAt = new Date(); // Now
        await existingStatus.save();

        return res.status(200).json({
          success: true,
          message: 'Task marked as completed.',
          taskStatus: existingStatus
        });
      }

      return res.status(400).json({ message: 'Task status cannot be updated.' });
    }

    const alreadyExists = await TaskStatus.findOne({
      user: userId,
      task: taskId,
      date: {
        $gte: assignedDate,
        $lt: new Date(assignedDate.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (alreadyExists) {
      return res.status(409).json({ message: 'Task already marked for this date.' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (assignedDate.toDateString() !== today.toDateString()) {
      return res.status(400).json({ message: 'You can only submit tasks for today.' });
    }

    const newStatus = new TaskStatus({
      user: userId,
      task: taskId,
      date: assignedDate,
      completedAt: new Date(),
      status: 'completed',
    });

    await newStatus.save();

    res.status(201).json({ success: true, message: 'Task submitted successfully.', taskStatus: newStatus });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const fetchTasksToCopyForUser = async (req, res) => {
  try {

    const {userId
} = req.params; 
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });

    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const tasks = await Task.find({ users_assigned: userId });
   
    res.json({tasks, message: `Tasks fetched successfully for the user ${user.name}.`});
  }catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}





module.exports = {
  addTask,
  editTask,
  deleteTask,
  getTaskByUserId,
  submitTask,
  fetchTaskStatusForUser,
fetchTasksToCopyForUser
};