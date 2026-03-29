const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductCommentSchema = new Schema({
        productId: {
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
                },
                isEditing: {
                    type: Boolean,
                    required: false,
                    default: false
                }
            }
        ]
    });

module.exports = mongoose.model('ProductComment', ProductCommentSchema);