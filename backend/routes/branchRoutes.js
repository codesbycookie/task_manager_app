const express = require('express');
const router = express.Router();

const verifyTask = require('../middlewares/verifyTask');
const verifyAdmin = require('../middlewares/verifyAdmin');
const verifyUser = require('../middlewares/verifyUser');
const verifyBranch = require('../middlewares/verifyBranch');

const { addBranch, editBranch, deleteBranch, getBranches } = require('../controllers/branchController');

router.post('/admin/create-branch', verifyAdmin, addBranch);
router.get('/admin/branches', verifyAdmin, getBranches);
router.put('/admin/edit-branch/:branchId', verifyAdmin, verifyBranch, editBranch);
router.delete('/admin/delete-branch/:branchId', verifyAdmin, verifyBranch, deleteBranch);

module.exports = router