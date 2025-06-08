const express = require('express');
const router = express.Router();

const verifyTask = require('../middlewares/verifyTask');
const verifyAdmin = require('../middlewares/verifyAdmin');
const verifyUser = require('../middlewares/verifyUser');
const verifyBranch = require('../middlewares/verifyBranch');


const {addTask, editTask, deleteTask, getTaskByUserId, submitTask, fetchTaskStatusForUser} = require('../controllers/taskController');

router.post('/admin/add-task', verifyAdmin, addTask)
router.put('/admin/edit-task/:taskId', verifyAdmin, verifyTask, editTask)
router.delete('/admin/delete-task/:taskId', verifyAdmin, verifyTask, deleteTask)
router.get('/admin/tasks-for-user/:userId',  getTaskByUserId)
router.post('/submit-task', verifyUser, verifyTask, submitTask)
router.get('/fetch-tasks-for-user/:userId', verifyUser, fetchTaskStatusForUser)


module.exports = router