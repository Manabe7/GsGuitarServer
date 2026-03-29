const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSettingSchema = new Schema({
    userID: {
        type: String,
        required: false
    },
    darkMode: {
        type: Boolean,
        required: false,
        default: false
    },
    notifications:{
        email: {
            type: Boolean,
            required: false,
            default: false
        },
        push: {
            type: Boolean,
            required: false,
            default: false
        },
        sms: {
            type: Boolean,
            required: false,
            default: false
        }
    }
    ,

});

module.exports = mongoose.model('UserSetting', userSettingSchema);