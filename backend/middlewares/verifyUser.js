const User = require('../models/user')
const Task = require('../models/task')

module.exports = async function verifyUserAndTask(req, res, next) {
    try {

        console.log("Verifying user...");

    const userId = req.params.userId || req.body.userId;

    console.log('userid middleware',userId)

    if (!userId) {
      return res.status(400).json({ message: 'Missing userId or taskId' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

   

    req.user = user;

    next();
  } catch (err) {
    console.error('User verification failed:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}