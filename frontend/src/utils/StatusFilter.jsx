export const getFilteredTaskStatuses = (tasks, selectedDate, statusFilter) => {
  const selected = new Date(selectedDate);
  selected.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayName = selected.toLocaleDateString("en-US", { weekday: "long" });
  const dayNumber = selected.getDate();

  return tasks
    .filter((sheet) => {
      const task = sheet.task;
      const taskDate = task.date ? new Date(task.date) : null;
      taskDate?.setHours(0, 0, 0, 0);

      const matchFrequency =
        task.frequency === "daily" ||
        (task.frequency === "weekly" && task.days?.includes(dayName)) ||
        (task.frequency === "monthly" && task.dates?.includes(dayNumber)) ||
        (task.frequency === "once" &&
          taskDate?.getTime() === selected.getTime());

      return matchFrequency;
    })
    .map((sheet) => {
      const taskStatusDate = sheet.date ? new Date(sheet.date) : null;
      taskStatusDate?.setHours(0, 0, 0, 0);

      const isCompletedToday =
        sheet.status === "completed" &&
        taskStatusDate &&
        taskStatusDate.getTime() === selected.getTime();

      const isMissedToday =
        sheet.status === "missed" &&
        taskStatusDate &&
        taskStatusDate.getTime() === selected.getTime();

      let status = "not completed";
      let dateField = "-";

      if (selected < today) {
        status = isCompletedToday ? "completed" : "missed";
        dateField = isCompletedToday
          ? taskStatusDate.toISOString().split("T")[0]
          : "-";
      } else if (selected > today) {
        status = isCompletedToday ? "completed" : "yet to complete";
        dateField = isCompletedToday
          ? taskStatusDate.toISOString().split("T")[0]
          : "-";
      } else {
        // Today
        if (isCompletedToday) {
          status = "completed";
          dateField = taskStatusDate.toISOString().split("T")[0];
        } else if (isMissedToday) {
          status = "missed";
        } else {
          status = "not completed";
        }
      }

      return {
        ...sheet,
        status,
        date: dateField,
      };
    })
    .filter((sheet) => statusFilter === "all" || sheet.status === statusFilter);
};
