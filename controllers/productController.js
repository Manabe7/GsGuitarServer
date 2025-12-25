const Product = require('../model/Product');
const ProductDetail = require('../model/ProductDetail');

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    }   catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Get product by ID with details
exports.getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product
            .findOne({ productID: id })
            .lean(); // Use lean() to get a plain JavaScript object

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const productDetail = await ProductDetail.findOne({ productID: id }).lean();
        if (productDetail) {
            product.details = productDetail; // Merge details into the product object
        }
        res.status(200).json(product);
    } catch (error) {   
        res.status(500).json({ message: 'Server Error', error });
    }   
};

// Get order details by user ID
exports.getOrderDetailsByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const orders = await Order.find({ userID: userId });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Create a new product 
exports.createProduct = async (req, res) => {
    const { productID, name, price, quantity, image } = req.body;
    const checkExisting = await Product.findOne({productID});
    if (checkExisting) {
        return res.status(409).json({ message: 'ProductID already exists' });
    }
    try {   
        const newProduct = new Product({
            productID,
            name,   
            price,
            quantity,
            image
        });
        await newProduct.save();
        res.status(201).json(newProduct);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }       
};

// Update product by ID 
exports.updateProductById = async (req, res) => {
    const { id } = req.params;
    const { name, price, quantity, image } = req.body;  
    try {
        const updatedProduct = await    Product.findOneAndUpdate(
            { productID: id },
            { name, price, quantity, image },
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Delete product by ID 
exports.deleteProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await Product.findOneAndDelete   ({ productID: id });
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }   
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Search products by name
exports.searchProductsByName = async (req, res) => {
    const { name } = req.query;
    try {
        const products = await Product.find({
            name: { $regex: name, $options: 'i' } // Case-insensitive search
        });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Filter products by price range
exports.filterProductsByPriceRange = async (req, res) => {
    const { minPrice, maxPrice } = req.query;
    try {
        const products = await Product.find({
            price: { $gte: Number(minPrice), $lte: Number(maxPrice) }
        });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }   
};

// Sort products by price
exports.sortProductsByPrice = async (req, res) => {
    const { order } = req.query;    
    try {
        const sortOrder = order === 'desc' ? -1 : 1;
        const products = await Product.find().sort({ price: sortOrder });
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};
// Paginate products
exports.paginateProducts = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; 
    try {
        const products = await Product.find()
            .skip((page - 1) * limit)
            .limit(Number(limit));
        res.status(200).json(products);
    }   catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Get products with low stock
exports.getLowStockProducts = async (req, res) => {
    const { threshold = 5 } = req.query;
    try {
        const products = await Product.find({
            quantity: { $lte: Number(threshold) }
        });
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};
// Update product stock after an order
exports.updateProductStockAfterOrder = async (orderItems) => {
    try {       
        for (const item of orderItems) {
            const product = await Product.findOne({ productID: item.productID });
            if (product) {
                product.quantity -= item.quantity;
                await product.save();
            }
        }
    }
    catch (error) {
        console.error('Error updating product stock:', error);
    }
};
// Get products by category
exports.getProductsByCategory = async (req, res) => {
    const { category } = req.params;
    try {
        const productDetails = await ProductDetail.find({ category });
        const productIDs = productDetails.map(detail => detail.productID);
        const products = await Product.find({ productID: { $in: productIDs } });
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};
// Get products by brand
exports.getProductsByBrand = async (req, res) => {
    const { brand } = req.params;
    try {
        const productDetails = await ProductDetail.find({ brand });
        const productIDs = productDetails.map(detail => detail.productID);
        const products = await Product.find({ productID: { $in: productIDs } });
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};
// Get top-rated products
exports.getTopRatedProducts = async (req, res) => {
    const { limit = 10 } = req.query;   
    try {
        const productDetails = await ProductDetail.find()
            .sort({ rating: -1 })
            .limit(Number(limit));
        const productIDs = productDetails.map(detail => detail.productID);
        const products = await Product.find({ productID: { $in: productIDs } });
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};  
// Get products with reviews above a certain number
exports.getProductsByReviewCount = async (req, res) => {
    const { minReviews = 10 } = req.query;
    try {
        const productDetails = await ProductDetail.find({
            reviews: { $gte: Number(minReviews) }
        });
        const productIDs = productDetails.map(detail => detail.productID);
        const products = await Product.find({ productID: { $in: productIDs } });
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};
// Get products by feature
exports.getProductsByFeature = async (req, res) => {
    const { feature } = req.params;
    try {
        const productDetails = await ProductDetail.find({
            features: feature
        });
        const productIDs = productDetails.map(detail => detail.productID);
        const products = await Product.find({ productID: { $in: productIDs } });
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};  

exports.getTotalProductCount = async (req, res) => {
    try {
        const count = await Product.countDocuments();
        res.status(200).json({ totalProducts: count });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }   
};
// Get average product price
exports.getAverageProductPrice = async (req, res) => {
    try {
        const result = await Product.aggregate([
            {
                $group: {   
                    _id: null,
                    averagePrice: { $avg: "$price" }
                }
            }
        ]);
        const averagePrice = result[0] ? result[0].averagePrice : 0;
        res.status(200).json({ averagePrice });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }   
};

// Get products by multiple filters (category, brand, price range)
exports.getProductsByMultipleFilters = async (req, res) => {
    const { category, brand, minPrice, maxPrice } = req.query;
    try {
        const filter = {};
        if (category) {
            const productDetailsByCategory = await ProductDetail.find({ category });
            const productIDsByCategory = productDetailsByCategory.map(detail => detail.productID);
            filter.productID = { $in: productIDsByCategory };
        }
        if (brand) {
            const productDetailsByBrand = await ProductDetail.find({ brand });
            const productIDsByBrand = productDetailsByBrand.map(detail => detail.productID);
            filter.productID = filter.productID || {};
            filter.productID.$in = filter.productID.$in || [];
            filter.productID.$in.push(...productIDsByBrand);
        }
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }   
        const products = await Product.find(filter);
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};


