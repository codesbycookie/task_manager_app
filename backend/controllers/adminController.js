const Admin = require('../models/admin');
const User = require('../models/user')
const Task = require('../models/task')
const TaskStatus = require('../models/taskStatus');
const Branch = require('../models/branch')


const adminLogin = async(req, res) => {
    try {
        const {uid} = req.body;
        const admin = await Admin.findOne({uid: uid});
        if(!admin){
            return res.status(404).json({ message: 'Admin not found.' });
        }
        const users = await User.find({}).populate('branch');
        const tasks = await TaskStatus.find({})
        const branches = await Branch.find({});

        
        res.status(200).json({
            message: 'Admin logged in successfully.',
            admin,
            users,
            tasks,
            branches
        });
    }catch(err){
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
}

module.exports = {adminLogin}