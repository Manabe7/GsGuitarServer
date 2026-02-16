const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderHistorySchema = new Schema({
    userID: {
        type: String,
        required: false
    },
    orderItems: [
        {
            productID: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: false,
        default: 0
    },
    orderDate: {
        type: Date,
        required: false,
        default: Date.now
    },
    status: {
        type: String,
        required: false,
        default: 'pending'
    }
});

module.exports = mongoose.model('OrderHistory', orderHistorySchema);