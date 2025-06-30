const Admin = require('../models/admin');


module.exports = async function verifyAdmin(req, res, next) {
    try {
        const adminUid = req.headers['admin_uid'];
        if (!adminUid) {
            return res.status(403).json({ message: "Forbidden, header not available." });
        }

        const admin = await Admin.findOne({ uid: adminUid })

        if(!admin){
            return res.status(403).json({ message: "Forbidden: only admin can access this." });
        }
        req.admin = admin;
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
}