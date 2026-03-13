const User = require('../models/user');
const Task = require('../models/task');
const TaskStatus = require('../models/taskStatus');

// ─── Helpers ─────────────────────────────────────────────────────────────────

const isValidId = (id) => id && id !== 'undefined' && id !== 'null';

const normalizeDate = (date) => {
  const d = date ? new Date(date) : new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const getEndOfDay = (date) => {
  const d = normalizeDate(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

// Highest priority used today + 1, or 1 if none
const getNextPriority = async (userId, date) => {
  const last = await TaskStatus
    .findOne({ user: userId, date: { $gte: normalizeDate(date), $lte: getEndOfDay(date) } })
    .sort({ priority: -1 });
  return last ? last.priority + 1 : 1;
};

// Most recent priority for this user+task across all dates
const getLastPriority = async (userId, taskId) => {
  const last = await TaskStatus.findOne(
    { user: userId, task: taskId },
    { priority: 1 },
    { sort: { date: -1 } }
  );
  return last ? last.priority : null;
};

// Shared logic: fetch + auto-create missing TaskStatus records for a given date
const resolveTaskStatusesForDate = async (userId, targetDate) => {
  const start     = normalizeDate(targetDate);
  const end       = getEndOfDay(targetDate);
  const dayName   = start.toLocaleDateString('en-US', { weekday: 'long' });
  const dayNumber = start.getDate();

  // Fetch existing statuses for this date
  let taskStatuses = await TaskStatus
    .find({ user: userId, date: { $gte: start, $lte: end } })
    .populate('task')
    .populate('user')
    .sort({ priority: 1 });

  const statusMap = new Map(taskStatuses.map((s) => [s.task._id.toString(), s]));

  // Find tasks due on this date with no TaskStatus yet
  const allTasks      = await Task.find({ users_assigned: userId });
  const tasksToCreate = allTasks.filter((task) => {
    const taskDate = task.date ? normalizeDate(task.date) : null;
    const isDue =
      task.frequency === 'daily' ||
      (task.frequency === 'weekly'  && task.days?.includes(dayName))    ||
      (task.frequency === 'monthly' && task.dates?.includes(dayNumber)) ||
      (task.frequency === 'once'    && taskDate?.getTime() === start.getTime());
    return isDue && !statusMap.has(task._id.toString());
  });

  if (tasksToCreate.length > 0) {
    let nextPriority    = await getNextPriority(userId, start);
    const usedPriorities = new Set(taskStatuses.map((s) => s.priority));

    const newEntries = await Promise.all(
      tasksToCreate.map(async (task) => {
        const inherited = await getLastPriority(userId, task._id);

        let priority;
        if (inherited !== null && !usedPriorities.has(inherited)) {
          priority = inherited;
        } else {
          while (usedPriorities.has(nextPriority)) nextPriority++;
          priority = nextPriority++;
        }
        usedPriorities.add(priority);

        return { user: userId, task: task._id, date: start, status: 'not completed', priority };
      })
    );

    // ✅ upsert with $setOnInsert — never overwrites existing priority
    await TaskStatus.bulkWrite(
      newEntries.map((entry) => ({
        updateOne: {
          filter: { user: entry.user, task: entry.task, date: entry.date },
          update:  { $setOnInsert: entry },
          upsert:  true,
        },
      })),
      { ordered: false }
    );

    // Re-fetch newly created records with populated fields
    const populatedNew = await TaskStatus
      .find({ user: userId, task: { $in: newEntries.map((e) => e.task) }, date: { $gte: start, $lte: end } })
      .populate('task')
      .populate('user');

    // Add only ones not already in taskStatuses
    const existingIds = new Set(taskStatuses.map((s) => s._id.toString()));
    populatedNew.forEach((s) => {
      if (!existingIds.has(s._id.toString())) taskStatuses.push(s);
    });
  }

  taskStatuses.sort((a, b) => (a.priority ?? Infinity) - (b.priority ?? Infinity));

  return taskStatuses.map((s) => ({
    task:        s.task,
    status:      s,
    completedAt: s.completedAt || null,
    date:        s.date,
  }));
};

// ─── Add Task ─────────────────────────────────────────────────────────────────

const addTask = async (req, res) => {
  try {
    const {
      title,
      description,
      frequency,
      days    = [],
      date    = null,
      dates   = [],
      users_assigned = [],
      branch  = null,
    } = req.body;

    const allowedFrequencies = ['once', 'daily', 'weekly', 'monthly'];
    if (!allowedFrequencies.includes(frequency))
      return res.status(400).json({ message: 'Invalid frequency type.' });
    if (frequency === 'once' && !date)
      return res.status(400).json({ message: 'Date is required for once tasks.' });
    if (frequency === 'monthly' && (!dates || dates.length === 0))
      return res.status(400).json({ message: 'Dates are required for monthly tasks.' });
    if (frequency === 'weekly' && (!days || days.length === 0))
      return res.status(400).json({ message: 'Days are required for weekly tasks.' });

    const task = new Task({ title, description, frequency, days, dates, date, users_assigned, branch });
    await task.save();

    const today = normalizeDate();

    // ✅ New task — no previous record exists, just append at end of today's list
    const taskStatusEntries = await Promise.all(
      users_assigned.map(async (userId) => ({
        user:     userId,
        task:     task._id,
        date:     today,
        status:   'not completed',
        priority: await getNextPriority(userId, today),
      }))
    );

    await TaskStatus.insertMany(taskStatusEntries);

    res.status(201).json({ message: 'Task created successfully', task });
  } catch (err) {
    console.error('[addTask]', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// ─── Edit Task ────────────────────────────────────────────────────────────────

const editTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    if (!isValidId(taskId))
      return res.status(400).json({ message: 'Valid Task ID is required.' });

    const updateData = { ...req.body };

    if (updateData.frequency === 'once')         { updateData.days = []; updateData.dates = []; }
    else if (updateData.frequency === 'daily')   { updateData.date = null; updateData.days = []; updateData.dates = []; }
    else if (updateData.frequency === 'weekly')  { updateData.date = null; updateData.dates = []; }
    else if (updateData.frequency === 'monthly') { updateData.date = null; updateData.days = []; }

    const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, { new: true, runValidators: true });

    if (!updatedTask)
      return res.status(404).json({ message: 'Task not found.' });

    res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
  } catch (err) {
    console.error('[editTask]', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// ─── Delete Task ──────────────────────────────────────────────────────────────

const deleteTask = async (req, res) => {
  try {
    const { taskStatusId } = req.params;

    if (!isValidId(taskStatusId))
      return res.status(400).json({ message: 'Valid TaskStatus ID is required.' });

    const deleted = await TaskStatus.findByIdAndDelete(taskStatusId).populate('task');
    if (!deleted)
      return res.status(404).json({ message: 'TaskStatus not found.' });

    // Re-sequence priorities for this user on the same day
    const start = normalizeDate(deleted.date);
    const end   = getEndOfDay(deleted.date);

    const remaining = await TaskStatus
      .find({ user: deleted.user, date: { $gte: start, $lte: end } })
      .sort({ priority: 1 });

    if (remaining.length > 0) {
      await TaskStatus.bulkWrite(
        remaining.map((t, i) => ({
          updateOne: {
            filter: { _id: t._id },
            update: { $set: { priority: i + 1 } }, // ✅ was missing $set
          },
        }))
      );
    }

    // Remove user from task's users_assigned
    const task = await Task.findById(deleted.task._id);
    if (task) {
      task.users_assigned = task.users_assigned.filter(
        (uid) => uid.toString() !== deleted.user.toString()
      );
      await task.save();
    }

    res.status(200).json({ message: 'Task deleted successfully', task: deleted.task });
  } catch (err) {
    console.error('[deleteTask]', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// ─── Reorder Tasks ────────────────────────────────────────────────────────────

const reorderTasks = async (req, res) => {
  try {
    const { userId } = req.params;
    const { tasks, date } = req.body;

    if (!isValidId(userId))
      return res.status(400).json({ message: 'Valid User ID is required.' });
    if (!Array.isArray(tasks) || tasks.length === 0)
      return res.status(400).json({ message: 'tasks array is required.' });
    if (!date)
      return res.status(400).json({ message: 'date is required.' });

    const start = normalizeDate(date);
    const end   = getEndOfDay(date);

    await TaskStatus.bulkWrite(
      tasks.map((taskStatusId, index) => ({
        updateOne: {
          filter: { _id: taskStatusId, user: userId, date: { $gte: start, $lte: end } },
          update:  { $set: { priority: index + 1 } },
        },
      }))
    );

    res.status(200).json({ message: 'Priority updated successfully.' });
  } catch (err) {
    console.error('[reorderTasks]', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// ─── Fetch Task Statuses For User (Today) ─────────────────────────────────────

const fetchTaskStatusForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!isValidId(userId))
      return res.status(400).json({ message: 'Valid User ID is required.' });

    const result = await resolveTaskStatusesForDate(userId, new Date());
    res.status(200).json({ tasks: result });
  } catch (err) {
    console.error('[fetchTaskStatusForUser]', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// ─── Get Tasks By User And Date (Admin) ───────────────────────────────────────

const getTasksByUserAndDate = async (req, res) => {
  try {
    const { userId } = req.params;
    const { date }   = req.query;

    if (!isValidId(userId))
      return res.status(400).json({ message: 'Valid User ID is required.' });

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: 'User not found.' });

    const result = await resolveTaskStatusesForDate(userId, date || new Date());
    res.status(200).json({ tasks: result, user });
  } catch (err) {
    console.error('[getTasksByUserAndDate]', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// ─── Submit Task ──────────────────────────────────────────────────────────────

const submitTask = async (req, res) => {
  try {
    const { userId, taskId, taskStatusId, date } = req.body;

    if (!userId || !taskId || !date)
      return res.status(400).json({ message: 'userId, taskId, and date are required.' });

    const assignedDate = normalizeDate(date);
    const today        = normalizeDate();

    if (taskStatusId) {
      const existing = await TaskStatus.findById(taskStatusId);
      if (!existing)
        return res.status(404).json({ message: 'TaskStatus not found.' });

      if (normalizeDate(existing.date).getTime() !== assignedDate.getTime())
        return res.status(400).json({ message: 'You can only submit for the assigned date.' });

      if (existing.status === 'completed')
        return res.status(409).json({ message: 'Task is already marked as completed.' });

      existing.status      = 'completed';
      existing.completedAt = new Date();
      await existing.save();

      return res.status(200).json({ success: true, message: 'Task marked as completed.', taskStatus: existing });
    }

    if (assignedDate.getTime() !== today.getTime())
      return res.status(400).json({ message: 'You can only submit tasks for today.' });

    const alreadyExists = await TaskStatus.findOne({
      user: userId,
      task: taskId,
      date: { $gte: assignedDate, $lt: new Date(assignedDate.getTime() + 24 * 60 * 60 * 1000) },
    });

    if (alreadyExists)
      return res.status(409).json({ message: 'Task already marked for this date.' });

    const newStatus = await TaskStatus.create({
      user: userId, task: taskId, date: today,
      completedAt: new Date(), status: 'completed',
    });

    res.status(201).json({ success: true, message: 'Task submitted successfully.', taskStatus: newStatus });
  } catch (err) {
    console.error('[submitTask]', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// ─── Fetch Tasks To Copy For User ─────────────────────────────────────────────

const fetchTasksToCopyForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!isValidId(userId))
      return res.status(400).json({ message: 'Valid User ID is required.' });

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: 'User not found.' });

    const tasks = await Task.find({ users_assigned: userId });
    res.status(200).json({ tasks, message: `Tasks fetched successfully for ${user.name}.` });
  } catch (err) {
    console.error('[fetchTasksToCopyForUser]', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// ─── Exports ──────────────────────────────────────────────────────────────────

module.exports = {
  addTask,
  editTask,
  deleteTask,
  submitTask,
  fetchTaskStatusForUser,
  getTasksByUserAndDate,
  fetchTasksToCopyForUser,
  reorderTasks,
};