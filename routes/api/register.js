const express = require('express');
const router = express.Router();
const registerController = require('../../controllers/registerController');

// Route to handle user registration
router.post('/', registerController.handleNewUser);

module.exports = router;