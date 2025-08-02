export const getFilteredTaskStatuses = (taskStatuses, tasks, selectedDate, statusFilter) => {
  const selected = new Date(selectedDate);
  selected.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayName = selected.toLocaleDateString("en-US", { weekday: "long" });
  const dayNumber = selected.getDate();

  // Create a lookup of task info
  const taskMap = new Map(tasks.map(task => [task._id.$oid, task]));

  // Filter status entries for selected date and keep only latest per task
  const latestStatusMap = new Map();

  taskStatuses.forEach((entry) => {
    const taskId = entry.task.$oid;
    const taskDate = new Date(entry.date.$date);
    taskDate.setHours(0, 0, 0, 0);

    if (taskDate.getTime() !== selected.getTime()) return;

    const key = taskId;
    const current = latestStatusMap.get(key);
    const updatedAt = new Date(entry.updatedAt?.$date || entry.createdAt?.$date);

    if (!current || new Date(current.updatedAt?.$date || current.createdAt?.$date) < updatedAt) {
      latestStatusMap.set(key, entry);
    }
  });

  // Final list after filtering by frequency, and constructing full status
  const result = [];

  for (const [taskId, statusEntry] of latestStatusMap.entries()) {
    const task = taskMap.get(taskId);
    if (!task) continue;

    const matchFrequency =
      task.frequency === "daily" ||
      (task.frequency === "weekly" && task.days?.includes(dayName)) ||
      (task.frequency === "monthly" && task.dates?.includes(dayNumber)) ||
      (task.frequency === "once" &&
        task.date &&
        new Date(task.date.$date).setHours(0, 0, 0, 0) === selected.getTime());

    if (!matchFrequency) continue;

    let status = "not completed";
    let dateField = "-";

    const isCompleted = statusEntry.status === "completed";
    const isMissed = statusEntry.status === "missed";

    if (selected < today) {
      status = isCompleted ? "completed" : "missed";
      dateField = isCompleted ? new Date(statusEntry.date.$date).toISOString().split("T")[0] : "-";
    } else if (selected > today) {
      status = isCompleted ? "completed" : "yet to complete";
      dateField = isCompleted ? new Date(statusEntry.date.$date).toISOString().split("T")[0] : "-";
    } else {
      if (isCompleted) {
        status = "completed";
        dateField = new Date(statusEntry.date.$date).toISOString().split("T")[0];
      } else if (isMissed) {
        status = "missed";
      } else {
        status = "not completed";
      }
    }

    if (statusFilter === "all" || status === statusFilter) {
      result.push({
        ...statusEntry,
        task,
        status,
        date: dateField,
      });
    }
  }

  return result;
};
