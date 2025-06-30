const User = require('../models/user')
const Task = require('../models/task')

module.exports = async function verifyUserAndTask(req, res, next) {
  try {
    const taskId = req.params.taskId || req.body.taskId;
    if (!taskId) {
      return res.status(400).json({ message: 'Missing userId or taskId' });
    }
    console.log(taskId)
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    req.task = task;
    next();
  } catch (err) {
    console.error('Task verification failed:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}