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

app.use(cors({ origin: '*' }))

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/TaskManager';

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

cron.schedule("0 0 * * *", async () => {
  console.log("⏰ Running daily missed task checker - 12:00 AM");

  try {
    const allUsers = await User.find();

    for (const user of allUsers) {
      await refreshMissedStatusesForUser(user._id);
      console.log(`✅ Checked missed tasks for user: ${user.name}`);
    }

    console.log("🎉 All users processed successfully");

  } catch (err) {
    console.error("❌ Error in cron job:", err.message);
  }
}, {
  timezone: "Asia/Kolkata",
});

app.listen(3000, () => {
  console.log('Listening to the port 3000');
})