// backend/firebase-admin.js
const firebaseAdmin = require('firebase-admin');

const serviceAccount = require('../utils/firebasekey.json');

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

module.exports = firebaseAdmin;
