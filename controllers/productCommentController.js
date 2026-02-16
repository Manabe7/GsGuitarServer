const ProductComment = require('../model/ProductComment');
const mongoose = require('mongoose');
const Product = require('../model/Product');
const Users = require('../model/User');
const OrderHistory = require('../model/OrderHistory');

// Add a comment to a product
exports.addComment = async (req, res) => {
    const { productId, commentText } = req.body;
    const date = new Date();
    const cookies = req.cookies;
        if (!cookies?.jwt) {
            return res.sendStatus(401).json({ user: null}); // Unauthorized
        }
        const refreshToken = cookies.jwt;
    
        // Check if the refresh token is in the database
        const foundUser = await Users.findOne({ refreshToken: refreshToken }).exec();
        if (!foundUser) {
            return res.sendStatus(401).json({ user: null }); // Unauthorized
        }
    
    //create function to check if user has purchased the product before allowing to comment
    const hasPurchasedProduct = async (userId, productId) => {
        const foundProduct = await Product.findOne({ _id: productId }).exec();
    if (!foundProduct) {
        return res.status(400).json({ message: 'Invalid product ID' });
    }
        const orders = await OrderHistory.find({ userID: userId }).exec();
        for (const order of orders) {
            for (const item of order.orderItems) {
                if (item.productID === foundProduct.productID) {
                    return true;
                }
            }
        }
        return false;
    };
    const purchased = await hasPurchasedProduct(foundUser._id, productId);
    if (purchased) {
        try {
        let productComment = await ProductComment.findOne({ productId : productId });
        const newComment = {
            email: foundUser.email,
            firstName: foundUser.firstName,
            commentText,
            date
        };
        if (productComment) {
            productComment.comments.push(newComment);
        } else {
            productComment = new ProductComment({
                productId,
                comments: [newComment]
            });
        }
        await productComment.save();
        res.status(201).json({ message: 'Comment added successfully', comment: newComment });
        } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
        }   
    }else  if (!purchased) {
        return res.status(402).json({ message: 'You have to purchased this product in order to comment.' });
    }
    
};

// Get comments for a product
exports.getComments = async (req, res) => {
     const { productId } = req.params;
    const productComment = await ProductComment.findOne({ productId : productId });
    try {
        if (!productComment) {
            productComment = new ProductComment({
                productId,
                comments: []
            });
            await productComment.save();
            return res.status(200).json({ productComment, message: 'No comments for this product yet' });
        }
        res.status(200).json(productComment.comments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a comment from a product
exports.deleteComment = async (req, res) => {
    try {
        const { productId, commentId } = req.params;
        const productComment = await ProductComment.findOne({ productId });
        if (!productComment) {
            return res.status(404).json({ message: 'Product comments not found' });
        }
        productComment.comments = productComment.comments.filter(comment => comment._id.toString() !== commentId);
        await productComment.save();
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update a comment for a product
exports.updateComment = async (req, res) => {
    try {
        const { productId, commentId } = req.params;
        const { commentText } = req.body;
        const productComment = await ProductComment.findOne({ productId });
        if (!productComment) {
            return res.status(404).json({ message: 'Product comments not found' });
        }
        const comment = productComment.comments.find(c => c._id.toString() === commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        comment.commentText = commentText;
        await productComment.save();
        res.status(200).json({ message: 'Comment updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
