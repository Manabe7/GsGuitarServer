const express = require('express');
const router = express.Router();
const loginController = require('../../controllers/loginController');

// Route to handle user login
router.post('/', loginController.handleLogin);

module.exports = router;