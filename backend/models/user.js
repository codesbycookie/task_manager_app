const mongoose = require('mongoose');

const user_schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }, 
    email: {
        type: String,
        required: true,
        unique: true
    }, 
    branch : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    uid: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
        default: ''
    }   
}, {timestamps: true})

const User = mongoose.model('User', user_schema);

module.exports = User     