const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productDetailSchema = new Schema({
    productID: {
        type: String,
        required: true
    },
    description: String,
    category: String,
    brand: String,
    rating: Number,
    reviews: Number,
    features: [String],
    weight: String
});

module.exports = mongoose.model('ProductDetail', productDetailSchema);