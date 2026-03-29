const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userProfileImageSchema = new Schema({
    image: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('UserProfileImage', userProfileImageSchema);