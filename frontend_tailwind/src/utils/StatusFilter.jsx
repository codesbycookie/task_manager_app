export const getFilteredTaskStatuses = (tasks, selectedDate, statusFilter) => {
  // console.log("filtering ");

  const selected = new Date(selectedDate);
  selected.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayName = selected.toLocaleDateString("en-US", { weekday: "long" });
  const dayNumber = selected.getDate();

  const filteredMap = new Map();

  for (const sheet of tasks) {
    const task = sheet.task;

    // Match frequency
    const taskDate = new Date(sheet.date);
    taskDate?.setHours(0, 0, 0, 0);

    // console.log(new Date(taskDate), new Date(selected));

    const matchFrequency =
      task.frequency === "daily" ||
      (task.frequency === "weekly" && task.days?.includes(dayName)) ||
      (task.frequency === "monthly" && task.dates?.includes(dayNumber)) ||
      (task.frequency === "once" && taskDate?.getTime() === selected.getTime());

    if (!matchFrequency) continue;

    // TaskStatus date
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
      dateField = isCompletedToday ? sheet.completedAt : "-";
    } else if (selected > today) {
      status = isCompletedToday ? "completed" : "yet to complete";
      dateField = isCompletedToday ? sheet.completedAt : "-";
    } else {
      if (isCompletedToday) {
        status = "completed";
        dateField = sheet.completedAt;
      } else if (isMissedToday) {
        status = "missed";
      } else {
        status = "not completed";
      }
    }

    // const id = sheet._id.slice(0, 6) + task._id.slice(0, 6);

    // const key = `${sheet._id}_${selected.toISOString()}`;

    // console.log(tasks);

    const sheetDate = sheet.completedAt ? new Date(sheet.completedAt) : null;

    if (
      sheet.status === "completed" &&
      sheetDate?.getTime() === selected.getTime()
    ) {
      // Always keep completed version for that date
      filteredMap.set(task._id, { ...sheet, status, date: dateField });
    } else {
      const completedExists = Array.from(filteredMap.values()).some(
        (s) =>
          s.task._id === task._id &&
          s.status === "completed" &&
          new Date(s.date).setHours(0, 0, 0, 0) === selected.getTime()
      );

      if (!completedExists) {
        filteredMap.set(task._id, { ...sheet, status, date: dateField });
      }
    }
  }

  // console.log(tasks, filteredMap);

  // return tasks;

  return Array.from(filteredMap.values()).filter(
    (sheet) => statusFilter === "all" || sheet.status === statusFilter
  );
};
