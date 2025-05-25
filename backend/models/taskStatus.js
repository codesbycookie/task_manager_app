const mongoose = require('mongoose');

const taskStatus_schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    date: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['completed', 'not completed'],
        default: 'not completed'
    }
}, { timestamps: true })

taskStatus_schema.index({ user: 1, task: 1, date: 1 }, { unique: true });


const TaskStatus = mongoose.model('TaskStatus', taskStatus_schema);

module.exports = TaskStatus

