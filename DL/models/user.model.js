const mongoose = require('mongoose')
require('./chat.model')
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    chats: [{
        chat: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'chats'
        },
        isSent: {
            type: Boolean,
            default: false
        },
        isRecieved: {
            type: Boolean,
            default: false
        },
        isFavorite: {
            type: Boolean,
            default: false
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        isDraft: {
            type: Boolean,
            default: false
        },
        isRead: {
            type: Boolean,
            default: false
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    }
})
const userModel = mongoose.model('users', userSchema)
module.exports = userModel