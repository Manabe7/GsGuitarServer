const express = require('express');
const router = express.Router();
const userProfileController = require('../../controllers/userProfileController');

// Route to get user profile
router.get('/', userProfileController.getUserProfile);
// Route to update user profile
router.put('/updateProfile', userProfileController.updateUserProfile);
// Route to get user address
router.get('/address', userProfileController.getUserAddress);
// Route to update user profile
router.put('/updateAddress', userProfileController.updateUserAddress);
// Route to update user information
router.patch('/updatePassword', userProfileController.UpdateUserPassword);
// Route to delete user
router.delete('/:id', userProfileController.deleteUser);
module.exports = router;

