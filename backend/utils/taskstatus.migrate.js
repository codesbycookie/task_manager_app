const mongoose = require("mongoose");
const TaskStatus = require("../models/taskStatus");

async function migratePriority() {
  try {
    await mongoose.connect("mongodb+srv://akileshsampath1404:akileshdb123456@sap-checklist-database.jfltzs9.mongodb.net/sap-checklist-app?retryWrites=true&w=majority&appName=Cluster0");

    const users = await TaskStatus.distinct("user");

    for (const userId of users) {

      const tasks = await TaskStatus
        .find({ user: userId })
        .sort({ createdAt: 1 });

      for (let i = 0; i < tasks.length; i++) {
        tasks[i].priority = i + 1;
        await tasks[i].save();
      }

      console.log(`Migrated priorities for user ${userId}`);
    }

    console.log("Priority migration completed.");
    process.exit();

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

migratePriority();