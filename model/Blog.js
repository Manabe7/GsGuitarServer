const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
            title: {
                type: String,
                required: false
            },
            description: {
                type: String,
                required: false,
            },
            image: {
                type: String,
                required: false,
            },
            date: {
                type: Date,
                required: false,
            },
            content : {
                type: String,
                required: false,
            }
        });

module.exports = mongoose.model('Blog', BlogSchema);