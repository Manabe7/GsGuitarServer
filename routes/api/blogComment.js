const express = require('express');
const router = express.Router();
const blogCommentController = require('../../controllers/blogCommentController');

// Route to get comments for a specific blog post
router.get('/:BlogId/comments', blogCommentController.getCommentsByBlogId);
// Route to add a comment to a specific blog post
router.post('/comments', blogCommentController.addCommentToBlog);
// Route to delete a comment from a specific blog post
router.delete('/:BlogId/comments/:commentId', blogCommentController.deleteCommentFromBlog);
// Route to update a comment in a specific blog post
router.patch('/:BlogId/comments/:commentId', blogCommentController.updateCommentInBlog);

module.exports = router;