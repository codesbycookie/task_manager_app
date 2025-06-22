const verifyTask = require('../middlewares/verifyTask');
const verifyAdmin = require('../middlewares/verifyAdmin');
const verifyUser = require('../middlewares/verifyUser');
const verifyBranch = require('../middlewares/verifyBranch');
const firebaseAdmin = require('../firebase/firebase')
const Admin = require('../models/admin');
const User = require('../models/user')
const Task = require('../models/task')
const TaskStatus = require('../models/taskStatus');
const Branch = require('../models/branch');


const editUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const newUserData = req.body;

    const oldUser = await User.findById(userId).populate('branch');
    if (!oldUser) {
      return res.status(404).json({ message: 'User not found!' });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, newUserData, {
      new: true,
      runValidators: true,
    }).populate('branch');

    const oldBranch = await Branch.findById(oldUser.branch._id)

    oldBranch.members_count = oldBranch.members_count - 1

    await oldBranch.save();

    const newBranch = await Branch.findById(updatedUser.branch._id)

    newBranch.members_count = newBranch.members_count + 1

    await newBranch.save();

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

    user.last_login = new Date();

    await user.save();

    res.status(200).json({ message: 'User Login Successful!', user: user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const userRegister = async (req, res) => {
  try {
    const {
      name,
      email,
      branchId,
      phone_number,
      uid,
      address,
      copyFromUserId,
      tasksToCopy = []
    } = req.body;

    console.log({ name, email, branchId, phone_number, copyFromUserId, uid, address, tasksToCopy });

    // Create new user
    const user = new User({ name, email, branch: branchId, phone_number, uid, address });
    await user.save();

    // Update branch member count
    const branch = await Branch.findById(branchId);
    if (branch) {
      branch.members_count = (branch.members_count || 0) + 1;
      await branch.save();
    }

    // Selective task copying logic
    if (copyFromUserId && tasksToCopy.length > 0) {
      const tasks = await Task.find({ _id: { $in: tasksToCopy } });

      for (const task of tasks) {
        if (!task.users_assigned.includes(user._id)) {
          task.users_assigned.push(user._id);
          await task.save();

          await TaskStatus.create({
            task: task._id,
            user: user._id,
            status: 'not completed',
            date: new Date(), // you may want to adjust this to today's schedule
          });

          console.log("✅ Task copied:", task.title);
        }
      }
    }

    res.status(201).json({
      message: "User Registered Successfully.",
      user: user,
      copiedTasks: tasksToCopy.length
    });

  } catch (err) {
    console.error("❌ Error registering user:", err);
    res.status(500).json({ message: err.message });
  }
};


const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate('branch');
    console.log
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    // Decrement member count in the branch

    const branch = await Branch.findById(user.branch._id);

    branch.members_count = branch.members_count - 1

    await branch.save()

    await firebaseAdmin.auth().deleteUser(user.uid);


    const deletedUser = await User.findByIdAndDelete(userId);


    res.status(200).json({
      message: 'User deleted successfully',
      user: deletedUser
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message });
  }
}

const getAllUsers = async(req, res) => {
    try {
        const users = await User.find({}).populate('branch');
        console.log(users)
        res.status(200).json({ message: 'Users fetched successfully', users });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


module.exports = {
  editUser,
  userLogin,
  deleteUser,
  userRegister,
  getAllUsers
}
 