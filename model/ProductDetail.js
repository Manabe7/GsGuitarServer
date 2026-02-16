const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productDetailSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    productID: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: [{
        type: String,
        required: true
    }],
    brand: {
        type: String,
        required: true
    },
    name : {
        type: String,
        required: true
    },
    image : [{
        type: String,
        required: false
    }]
});

module.exports = mongoose.model('ProductDetail', productDetailSchema);