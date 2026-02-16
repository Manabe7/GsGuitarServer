const express = require('express');
const router = express.Router();
const blogController = require('../../controllers/blogController');

// Route to get all blog items
router.get('/', blogController.getAllBlogItems);
// Route to get a blog item by ID
router.get('/:id', blogController.getBlogById);
// Route to add a new blog item
router.post('/', blogController.addBlogItem);
// Route to update a blog item
router.patch('/:itemId', blogController.updateBlogItem);
// Route to delete a blog item
router.delete('/:itemId', blogController.deleteBlogItem);

module.exports = router;
