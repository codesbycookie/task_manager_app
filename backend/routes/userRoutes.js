const express = require('express');
const router = express.Router();

const verifyTask = require('../middlewares/verifyTask');
const verifyAdmin = require('../middlewares/verifyAdmin');
const verifyUser = require('../middlewares/verifyUser');
const verifyBranch = require('../middlewares/verifyBranch');

const { userLogin, editUser, userRegister, deleteUser } = require('../controllers/userController');

router.post('/user-login', userLogin)
router.put('/user-update/:userId', verifyUser, editUser)
router.post('/user-register', verifyAdmin, verifyBranch, userRegister);
router.delete('/admin/user-delete/:userId', verifyAdmin, deleteUser);


module.exports = router