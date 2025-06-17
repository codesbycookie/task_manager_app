const express = require('express');
const router = express.Router();
const User = require('../models/user');
const verifyTask = require('../middlewares/verifyTask');
const verifyAdmin = require('../middlewares/verifyAdmin');
const verifyUser = require('../middlewares/verifyUser');
const verifyBranch = require('../middlewares/verifyBranch');

const { userLogin, editUser, userRegister, deleteUser, getAllUsers } = require('../controllers/userController');

router.post('/user-login', userLogin)
router.put('/user-update/:userId', verifyUser, editUser)
router.post('/user-register', verifyAdmin, verifyBranch, userRegister);
router.delete('/admin/user-delete/:userId', verifyAdmin, deleteUser);
router.get('/get-all-users', verifyAdmin, getAllUsers)

module.exports = router