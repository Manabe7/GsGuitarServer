const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userProfileSchema = new Schema({
    userID: {
        type: String,
        required: false
    },
    street: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    postalCode: {
        type: String,
        required: false
    },
    phoneNumber: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('UserProfile', userProfileSchema);