const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/cartController');

// Route to get all cart items
router.get('/', cartController.getCartItems);
// Route to add an item to the cart
router.post('/', cartController.addToCart);
// Route to update an item in the cart
router.patch('/', cartController.updateCartItems);
// Route to remove an item from the cart
router.delete('/:productID', cartController.removeFromCart);

module.exports = router;