const verifyTask = require('../middlewares/verifyTask');
const verifyAdmin = require('../middlewares/verifyAdmin');
const verifyUser = require('../middlewares/verifyUser');
const verifyBranch = require('../middlewares/verifyBranch');

const Admin = require('../models/admin');
const User = require('../models/user')
const Task = require('../models/task')
const TaskStatus = require('../models/taskStatus');
const Branch = require('../models/branch');


const editUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const newUserData = req.body;

    const oldUser = await User.findById(userId);
    if (!oldUser) {
      return res.status(404).json({ message: 'User not found!' });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, newUserData, {
      new: true,
      runValidators: true,
    });

    // If branch was changed, update member counts
    if (newUserData.branch && newUserData.branch !== oldUser.branch.toString()) {
      await Branch.findByIdAndUpdate(oldUser.branch, { $inc: { members_count: -1 } });
      await Branch.findByIdAndUpdate(newUserData.branch, { $inc: { members_count: 1 } });
    }

    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const userLogin = async (req, res) => {
  try {
    const { uid } = req.body;
    const user = await User.findOne({ uid: uid });
    if (!user) {
      return res.status(404).json({ message: 'User not found!' })
    }

    res.status(200).json({ message: 'User Login Successful!', user: user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const userRegister = async (req, res) => {
  try {
    const { name, email, branchId, phone_number, copyFromUserId, uid, address } = req.body;

    // Save user
    const user = new User({ name, email, branch: branchId, phone_number, uid, address });
    await user.save();

    // Increment member count in the branch
    await Branch.findByIdAndUpdate(branchId, { $inc: { members_count: 1 } });

    if (copyFromUserId) {
      const tasksToCopy = await Task.find({ users_assigned: copyFromUserId });

      console.log("Tasks to copy: ", tasksToCopy);
      for (const task of tasksToCopy) {
        if (!task.users_assigned.includes(user._id)) {
          task.users_assigned.push(user._id);
          await task.save();
          console.log("Task updated: ", task);
        }
      }
    }

    res.status(201).json({message: "User Registered Successfully.", user: user, copiedFrom: copyFromUserId || null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const deleteUser  = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    // Decrement member count in the branch
    await Branch.findByIdAndUpdate(user.branch, { $inc: { members_count: -1 } });

    const deletedUser = await User.findByIdAndDelete(userId);

    res.status(200).json({
      message: 'User deleted successfully',
      user: deletedUser
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


module.exports = {
    editUser,
    userLogin,
    deleteUser,
    userRegister
}


