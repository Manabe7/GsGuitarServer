const express = require('express');
const router = express.Router();
const notificationController = require('../../controllers/notificationController');


router.get('/get', notificationController.getUserNotifications);
router.post('/mark-as-read', notificationController.markNotificationAsRead);
router.post('/delete', notificationController.deleteNotification);

module.exports = router;