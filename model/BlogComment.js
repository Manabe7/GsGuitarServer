const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogCommentSchema = new Schema({
        blogId: {
            type: String,
            required: true
        },
        comments: [
            {
                userId: {
                    type: String,
                    required: false
                },
                email: {
                    type: String,
                    required: false
                },
                firstName: {
                    type: String,
                    required: false
                },
                image: {
                    type: String,
                    required: false
                },
                commentText: {
                    type: String,
                    required: false,
                },
                date: {
                    type: Date,
                    required: false,
                }
            }
        ]
    });

module.exports = mongoose.model('BlogComment', BlogCommentSchema);