const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartItemsSchema = new Schema({
    userID: {
        type: String,
        required: true
    },
    items:[
        {
            productID: {
                type: String,
                required: false
            },
            quantity: {
                type: Number,
                required: false,
            }
        }
    ]

});

module.exports = mongoose.model('CartItems', cartItemsSchema);