const express = require('express');
const router = express.Router();
const userProfileController = require('../../controllers/userProfileController');

// Route to get user profile
router.get('/', userProfileController.getUserProfile);
// Route to update user profile
router.put('/', userProfileController.updateUserProfile);
// Route to update user information
router.patch('/', userProfileController.UpdateUser);
// Route to delete user
router.delete('/:id', userProfileController.deleteUser);
module.exports = router;

