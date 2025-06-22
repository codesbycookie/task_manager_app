const TaskStatus = require('../models/taskStatus');
const Task = require('../models/task');

const refreshMissedStatusesForUser = async (userId) => {
  const tasks = await Task.find({ users_assigned: userId });
  const statuses = await TaskStatus.find({ user: userId }).populate('task').populate('user');

  const statusMap = new Map();
  statuses.forEach(s => {
    const dateKey = new Date(s.date).toISOString().split("T")[0];
    const key = `${dateKey}_${s.task._id}`;
    statusMap.set(key, s); 
  });

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  for (const task of tasks) {
    const key = `${todayStr}_${task._id}`;
    const weekday = today.toLocaleDateString("en-US", { weekday: "long" });
    const dateNum = today.getDate();

    const isDue =
      task.frequency === "daily" ||
      (task.frequency === "weekly" && task.days.includes(weekday)) ||
      (task.frequency === "monthly" && task.dates.includes(dateNum)) ||
      (task.frequency === "once" &&
        task.date &&
        new Date(task.date).toDateString() === today.toDateString());

    const statusToday = statusMap.get(key);

    if (isDue && statusToday && statusToday.status === 'not completed') {
      console.log(`Marking task "${task.title}" as missed.`);

      task.title = "This task is shit";
      await task.save();

      statusToday.status = 'missed';
      await statusToday.save();
    }
  }
};

module.exports = refreshMissedStatusesForUser;
