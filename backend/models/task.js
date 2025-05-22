const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const task_schema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true
    }, 
    users_assigned: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }], 
    frequency: {
        type: String,
        enum: ['once', 'daily', 'weekly', 'monthly']
    },
     days: {
        type: [String],
        default: []
    }, 
    date: {
        type: String,
    },
    templateId: {
        type: String,
        required: true,
        unique: true,
        default: () => uuidv4()
    }
}, {timestamps: true});

const Task = mongoose.model('Task', task_schema);

module.exports = Task