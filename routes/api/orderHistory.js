const express = require('express');
const router = express.Router();
const OrderHistoryController = require('../../controllers/orderHistoryController');

// Route to create a new order history
router.post('/', OrderHistoryController.createOrderHistory);
// Route to get order history for a user
router.get('/', OrderHistoryController.getOrderHistoryByUser);
// Route to get all order histories
//router.get('/', OrderHistoryController.getAllOrderHistories);
// Route to update order status
router.put('/:orderId/status', OrderHistoryController.updateOrderStatus);
// Route to delete an order history
router.delete('/:orderId', OrderHistoryController.deleteOrderHistory);
// Route to get a specific order history by ID
router.get('/:orderId', OrderHistoryController.getOrderHistoryById);


module.exports = router;
