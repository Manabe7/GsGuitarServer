const express = require('express');
const router = express.Router();
const userProfileImageController = require('../../controllers/userProfileImageController');

router.post('/upload', userProfileImageController.uploadProfileImage);
router.put('/update', userProfileImageController.updateUserProfileImage);
router.get('/all', userProfileImageController.getAllProfileImages);
router.post('/add', userProfileImageController.addProfileImage);

module.exports = router;