
const mongoose = require("mongoose");
const TaskStatus = require("../models/taskStatus");

async function resetPriorities() {
  try {
    await mongoose.connect("mongodb+srv://akileshsampath1404:akileshdb123456@sap-checklist-database.jfltzs9.mongodb.net/sap-checklist-app?retryWrites=true&w=majority&appName=Cluster0");

    const result = await TaskStatus.updateMany({}, { $set: { priority: 0 } });
    console.log(`✅ Reset ${result.modifiedCount} records to priority 0`);

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

resetPriorities();