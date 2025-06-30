const Branch = require('../models/branch');

module.exports = async function verifyBranch(req, res, next) {
    try {
        console.log("Verifying branch...");
        const branchId = req.params.branchId || req.body.branchId;
        if (!branchId) {
            return res.status(400).json({ message: 'Missing branchId' });
        }
        const branch = await Branch.findById(branchId);
        if (!branch) {
            return res.status(404).json({ message: 'Branch not found' });
        }
        req.branch = branch;
        next();
    } catch (err) {
        console.error('Branch verification failed:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};