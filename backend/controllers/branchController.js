const verifyTask = require('../middlewares/verifyTask');
const verifyAdmin = require('../middlewares/verifyAdmin');
const verifyUser = require('../middlewares/verifyUser');
const verifyBranch = require('../middlewares/verifyBranch');

const Admin = require('../models/admin');
const User = require('../models/user')
const Task = require('../models/task')
const TaskStatus = require('../models/taskStatus');
const Branch = require('../models/branch')



const addBranch = async (req, res) => {
  try {
    const { name, address, phone_number, members_count = 0 } = req.body;

    if (!name || !address || !phone_number) {
      return res.status(400).json({ message: 'Name, address, and phone number are required.' });
    }

    const existingBranch = await Branch.findOne({ name });
    if (existingBranch) {
      return res.status(409).json({ message: 'Branch with this name already exists.' });
    }

    const branch = new Branch({ name, address, phone_number, members_count });
    await branch.save();

    res.status(201).json({
      message: 'Branch created successfully.',
      branch
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
}

const editBranch = async (req, res) => {
  try {
    const { branchId } = req.params;
    const updateData = req.body;

    const updatedBranch = await Branch.findByIdAndUpdate(branchId, updateData, {
      new: true,
      runValidators: true
    });

    if (!updatedBranch) {
      return res.status(404).json({ message: 'Branch not found.' });
    }

    res.status(200).json({
      message: 'Branch updated successfully.',
      branch: updatedBranch
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
}

const deleteBranch = async (req, res) => {
  try {
    const { branchId } = req.params;

    const deletedBranch = await Branch.findByIdAndDelete(branchId);
    if (!deletedBranch) {
      return res.status(404).json({ message: 'Branch not found.' });
    }

    res.status(200).json({
      message: 'Branch deleted successfully.',
      branch: deletedBranch
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
}

const getBranches = async (req, res) => {
  try {
    const branches = await Branch.find();
    res.status(200).json({ branches });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
}


module.exports = {
    addBranch,
    editBranch,
    deleteBranch,
    getBranches
}