const express = require('express');
const router = express.Router();
const productDetailController = require('../../controllers/productDetailController');


// Route to get product detail by product ID
router.get('/:id', productDetailController.getProductDetailById);
// Route to add new product detail
router.post('/', productDetailController.addProductDetail);
// Route to update product detail by product ID
router.put('/:id', productDetailController.UpdateProductDetail);

module.exports = router;    