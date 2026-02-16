const express = require('express');
const router = express.Router();
const productCommentController = require('../../controllers/productCommentController');

// Route to add a comment to a product
router.post('/add', productCommentController.addComment);
// Route to get comments for a product
router.get('/:productId', productCommentController.getComments);    
// Route to delete a comment from a product
router.delete('/:productId/:commentId', productCommentController.deleteComment);
// Route to update a comment for a product
router.patch('/:productId/:commentId', productCommentController.updateComment);

module.exports = router;
