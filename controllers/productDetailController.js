const { add } = require('date-fns');
const ProductDetail = require('../model/ProductDetail');
const Product = require('../model/Product');

// Get product detail by product ID
const getProductDetailById = async (req, res) => {
    const { id } = req.params;
    try {
        const productDetail = await ProductDetail.findOne({ id: id });
        if (!productDetail) {
            return res.status(404).json({ message: 'Product detail not found' });
        }
        const productData = await Product.findOne({ _id: id }).exec();
        if (!productData) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }
        res.json({productDetail, productData});
    } catch (error) {
        console.error('Error fetching product detail:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


const addProductDetail = async (req, res) => {
    const { id, description, category, brand, image ,name} = req.body;
    const productData = await Product.findOne({ _id: id }).exec();
    if (!productData) {
        return res.status(400).json({ message: 'Invalid product ID' });
    }
    try {
        const productDetail = new ProductDetail({
            id : productData._id,
            productID : productData.productID,
            description : description,
            category : category,
            brand : brand,
            name : name || productData.name,
            image : image || productData.image,
        });
        await productDetail.save();
        res.status(201).json({productDetail, productData});
    } catch (error) {
        console.error('Error adding product detail:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const UpdateProductDetail = async (req, res) => {
    const { id } = req.params;
    const { description, category, brand, image, price, name, quantity } = req.body;
    try {
        const productDetail = await ProductDetail.findOne({ id: id });
        if (!productDetail) {
            return res.status(404).json({ message: 'Product detail not found' });
        }
        productDetail.description = description || productDetail.description;
        productDetail.category = category || productDetail.category;
        productDetail.brand = brand || productDetail.brand;
        productDetail.image = image || productDetail.image;
        productDetail.price = price || productDetail.price;
        productDetail.name = name || productDetail.name;
        productDetail.quantity = quantity || productDetail.quantity;
        await productDetail.save();
        res.json(productDetail);
    } catch (error) {
        console.error('Error updating product detail:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = {
    getProductDetailById,
    addProductDetail,
    UpdateProductDetail
};