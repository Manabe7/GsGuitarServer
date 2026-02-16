const OrderHistory = require('../model/OrderHistory');
const Users = require('../model/User');
const cartItems = require('../model/cartItems');
const Product = require('../model/Product');
const ProductDetail = require('../model/ProductDetail');
const UserProfile = require('../model/UserProfile')
const mongoose = require('mongoose');

// Add a new order to order history
exports.createOrderHistory = async (req, res) => {
    const { orderItems, totalAmount } = req.body;
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(401).json({ user: null}); // Unauthorized
    }
    const refreshToken = cookies.jwt;
    const foundUser = await Users.findOne({ refreshToken: refreshToken }).exec();
    if (!foundUser) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }
    const foundUserCart = await cartItems.findOne({ userID: foundUser._id }).exec();
    if (!foundUserCart) {
        return res.status(400).json({ message: 'User cart not found' });
    }
    const orderDate = new Date();
    const decreaseProductStock = async (item) => {
        const product = await Product.findOne({ productID: item.productID }).exec();
        if (product) {
            product.quantity = Math.max(0, product.quantity - item.quantity);
            await product.save();
        }
    };
    for (const item of orderItems) {
        await decreaseProductStock(item);
    }

    try {
        const newOrderHistory = new OrderHistory({
            userID: foundUser._id,
            orderItems,
            totalAmount,
            orderDate,
            status : 'pending'
        });
        await newOrderHistory.save();
        // Clear the user's cart after successful order creation
        await cartItems.deleteOne({ userID: foundUser._id }).exec();
        res.status(201).json({ message: 'Order history created successfully', orderHistory: newOrderHistory });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get order history for a user
exports.getOrderHistoryByUser = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(401).json({ user: null}); // Unauthorized
    }
    const refreshToken = cookies.jwt;
    const foundUser = await Users.findOne({ refreshToken: refreshToken }).exec();
    if (!foundUser) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }
    const userProfileData = await UserProfile.findOne({ userID : foundUser._id}).exec();
    const userData = {
        firstName : foundUser.firstName,
        lastName : foundUser.lastName,
        address : {
            street : userProfileData.street,
            city : userProfileData.city,
            country : userProfileData.country,
            postalCode : userProfileData.postalCode,
        }
    } 
    try {
        const orderHistories = await OrderHistory.find({ userID: foundUser._id }).exec();
        if (orderHistories.length === 0) {
            return res.status(200).json({ message: 'No order history found for this user' });
        }
        const detailedOrderHistories = await Promise.all(orderHistories.map(async (order) => {
            const detailedItems = await Promise.all(order.orderItems.map(async (item) => {
                const productProfile = await Product.findOne({ productID: item.productID }).exec();
                const itemDetail = {
                    image: productProfile ? productProfile.image : null,
                    name: productProfile ? productProfile.name : null,
                    price: productProfile ? productProfile.price : null

                }
                return {
                    ...item._doc,
                    ...itemDetail
                };
            }));
            return {
                ...order._doc,
                orderItems: detailedItems
            };
        }));
        res.status(200).json({detailedOrderHistories, userData});
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
/* 

exports.getAllOrderHistories = async (req, res) => {
    try {
        const orderHistories = await OrderHistory.find().exec();
        res.status(200).json(orderHistories);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
 */

exports.updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    try {
        const orderHistory = await OrderHistory.findById(orderId).exec();
        if (!orderHistory) {
            return res.status(404).json({ message: 'Order history not found' });
        }
        orderHistory.status = status;
        await orderHistory.save();
        res.status(200).json({ message: 'Order status updated successfully', orderHistory });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete an order history by ID
exports.deleteOrderHistory = async (req, res) => {
    const { orderId } = req.params;
    try {
        const orderHistory = await OrderHistory.findByIdAndDelete(orderId).exec();
        if (!orderHistory) {
            return res.status(404).json({ message: 'Order history not found' });
        }
        res.status(200).json({ message: 'Order history deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get a specific order history by ID
exports.getOrderHistoryById = async (req, res) => {
    const { orderId } = req.params;
    try {
        const orderHistories = await OrderHistory.findById(orderId).exec();
        if (orderHistories.length === 0) {
            return res.status(200).json({ message: 'No order history found for this user' });
        }
        const detailedOrderHistories = await Promise.all(orderHistories.orderItems.map( async (item) => {
            const productProfile = await Product.findOne({ productID: item.productID }).exec();
            const productDetail = await ProductDetail.findOne({ productID : item.productID }).exec();
                const itemDetail = {
                    image: productProfile ? productProfile.image : null,
                    name: productProfile ? productProfile.name : null,
                    price: productProfile ? productProfile.price : null,
                    category: productDetail.category,
                    id: productProfile._id
                }
                return {
                    ...item._doc,
                    ...itemDetail
                };
    }))
        res.status(200).json({orderHistories, detailedOrderHistories});
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


