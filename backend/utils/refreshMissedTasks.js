const TaskStatus = require('../models/taskStatus')
const Task = require('../models/task')

const refreshMissedStatusesForUser = async (userId) => {
  const tasks = await Task.find({ users_assigned: userId });
  const statuses = await TaskStatus.find({ user: userId });

  const statusMap = new Map();
  statuses.forEach(s => {
    console.log(s)
    const dateKey = new Date(s.date).toISOString().split("T")[0];
    const key = `${dateKey}_${s.task.toString()}`;
    statusMap.set(key, true);
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const missedEntries = [];

  for (const task of tasks) {
    const created = new Date(task.createdAt);
    created.setHours(0, 0, 0, 0);

    for (let d = new Date(created); d < today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      const key = `${dateStr}_${task._id.toString()}`;

      const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
      const dateNum = d.getDate();
    
      const isDue =
        (task.frequency === "daily") ||
        (task.frequency === "weekly" && task.days.includes(weekday)) ||
        (task.frequency === "monthly" && task.dates.includes(dateNum)) ||
        (task.frequency === "once" &&
          task.date &&
          new Date(task.date).toDateString() === d.toDateString());

      if (isDue && !statusMap.has(key)) {
        missedEntries.push({
          task: task._id,
          user: userId,
          date: new Date(d),
          status: 'missed'
        });
      }
    }
  }

  if (missedEntries.length > 0) {
    await TaskStatus.insertMany(missedEntries);
  }
};



module.exports = refreshMissedStatusesForUser