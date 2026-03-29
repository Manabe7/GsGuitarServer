const express = require('express');
const router = express.Router();
const userSettingController = require('../../controllers/userSettingController');

router.put('/update', userSettingController.updateUserSetting);
router.get('/get', userSettingController.getUserSetting);

module.exports = router;