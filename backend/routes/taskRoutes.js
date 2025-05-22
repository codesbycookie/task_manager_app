const express = require('express');
const router = express.Router();

const verifyTask = require('../middlewares/verifyTask');
const verifyAdmin = require('../middlewares/verifyAdmin');
const verifyUser = require('../middlewares/verifyUser');
const verifyBranch = require('../middlewares/verifyBranch');


const {addTask, editTask, deleteTask, getTaskByUserId, submitTask} = require('../controllers/taskController');

console.log ( {addTask, editTask, deleteTask, getTaskByUserId, submitTask})
router.post('/admin/add-task', verifyAdmin, addTask)
router.put('/admin/edit-task/:taskId', verifyAdmin, verifyTask, editTask)
router.delete('/admin/delete-task/:taskId', verifyAdmin, verifyTask, deleteTask)
router.get('/admin/tasks-for-user/:userId', verifyAdmin, verifyTask, getTaskByUserId)
router.post('/submit-task', verifyUser, verifyTask, submitTask)

module.exports = router