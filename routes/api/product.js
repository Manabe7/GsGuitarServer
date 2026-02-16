const express = require('express');
const router = express.Router();
const productController = require('../../controllers/productController');

// Route to get all products
router.get('/', productController.getAllProducts);
// Route to create a new product
router.post('/', productController.createProduct);
// Route to update a product by ID
router.put('/:id', productController.updateProductById);
// Route to delete a product by ID
router.delete('/:id', productController.deleteProductById);

module.exports = router;
