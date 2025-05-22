const mongoose = require('mongoose');

const branch_schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    }, 
    members_count: {
        type: Number,
        default: 0
    }
}, {timestamps: true})

const Branch = mongoose.model('Branch', branch_schema);

module.exports = Branch