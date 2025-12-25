const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    userID: {
        type: String,
        required: false
    },
    message: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        required: false
    },
    read: {
        type: Boolean,
        required: false,
        default: false
    }
});

module.exports = mongoose.model('Notification', notificationSchema);