const mongoose = require('mongoose');
const TaskStatus = require('../models/taskStatus'); // adjust path

const MONGO_URI = 'mongodb+srv://akileshsampath1404:akileshdb123456@sap-checklist-database.jfltzs9.mongodb.net/sap-checklist-app?retryWrites=true&w=majority&appName=Cluster0';

const normalizeDate = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const run = async () => {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  const all = await TaskStatus.find({});
  console.log(`Found ${all.length} TaskStatus records`);

  let updated = 0;
  let skipped = 0;

  const bulkOps = [];

  for (const ts of all) {
    if (!ts.date) {
      skipped++;
      continue;
    }

    const original = new Date(ts.date);
    const normalized = normalizeDate(original);

    // Only update if the date is actually different
    if (original.getTime() !== normalized.getTime()) {
      bulkOps.push({
        updateOne: {
          filter: { _id: ts._id },
          update: { $set: { date: normalized } },
        },
      });
      updated++;
    } else {
      skipped++;
    }
  }

  if (bulkOps.length > 0) {
    await TaskStatus.bulkWrite(bulkOps);
    console.log(`✅ Updated ${updated} records`);
  } else {
    console.log('✅ All records already normalized');
  }

  console.log(`⏭️  Skipped ${skipped} records (already normalized or no date)`);

  await mongoose.disconnect();
  console.log('Done');
};

run().catch((err) => {
  console.error('Script failed:', err);
  process.exit(1);
});