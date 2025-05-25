const express = require('express');
const router = express.Router();
const User = require('../models/user');
const verifyTask = require('../middlewares/verifyTask');
const verifyAdmin = require('../middlewares/verifyAdmin');
const verifyUser = require('../middlewares/verifyUser');
const verifyBranch = require('../middlewares/verifyBranch');

const { userLogin, editUser, userRegister, deleteUser } = require('../controllers/userController');

router.post('/user-login', userLogin)
router.put('/user-update/:userId', verifyUser, editUser)
router.post('/user-register', verifyAdmin, verifyBranch, userRegister);
router.delete('/admin/user-delete/:userId', verifyAdmin, deleteUser);
router.get('/get-all-users', verifyAdmin, async(req, res) => {
    try {
        const users = await User.find({}).populate('branch');
        console.log(users)
        res.status(200).json({ message: 'Users fetched successfully', users });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

module.exports = router