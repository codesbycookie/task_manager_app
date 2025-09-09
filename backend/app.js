const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cron = require("node-cron");
const User = require('./models/user');


dotenv.config();

// middlewares


const taskRoutes = require('./routes/taskRoutes')
const userRoutes = require('./routes/userRoutes');
const branchRoutes = require('./routes/branchRoutes');
const adminRoutes = require('./routes/adminRoutes');
const refreshMissedStatusesForUser = require('./utils/refreshMissedTasks');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  "https://task-manager-app-kywo.onrender.com",
  "https://www.tasklist.co.in"
];

app.use(cors({
  origin: allowedOrigins
}));


const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/TaskManager';
console.log("DB URL:", dbUrl);
//
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'CONNECTION FAILED!'));
db.once('open', () => {
  console.log('Database connected successfully!');
});


app.get('/', (req, res) => {
  res.send({ 'Hello world!': 'Hello from the server!' });
});


app.use('/api/tasks', taskRoutes);
app.use('/api/user', userRoutes);
app.use('/api/branch', branchRoutes);
app.use('/api/admin', adminRoutes);


// cron.schedule("0 0 * * *", async () => {
//   console.log(`⏰ [${new Date().toLocaleString()}] Running daily missed task checker`);

//   try {
//     const allUsers = await User.find();

//     await Promise.all(
//       allUsers.map(user =>
//         refreshMissedStatusesForUser(user._id)
//           .then(() => console.log(`✅ Checked missed tasks for user: ${user.name}`))
//           .catch(err => console.error(`❌ Error for user ${user.name}:`, err.message))
//       )
//     );

//     console.log("🎉 All users processed successfully");

//   } catch (err) {
//     console.error("❌ Error in cron job:", err.message);
//   }
// }, {
//   timezone: "Asia/Kolkata",
// });


app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening to the port ${process.env.PORT || 3000}`);
})