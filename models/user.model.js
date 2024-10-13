const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    preferences: {
        category: {
            type: String,
            required: true
        },
        language: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: false
        }
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;