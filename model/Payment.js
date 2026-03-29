const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userPaymentSchema = new Schema({
    userID: {
        type: String,
        required: false
    },
    paymentMethod: [
        {
        cardHolderName: {
            type: String,
            required: false
        },
        cardNumber: {
            type: String,
            required: false
        },
        expiryDate: {
            type: String,
            required: false
        },
        cvv: {
            type: String,
            required: false
        },
    }
    ]

});

module.exports = mongoose.model('UserPayment', userPaymentSchema);