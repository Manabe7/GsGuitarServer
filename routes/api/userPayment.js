const express = require('express');
const router = express.Router();
const userPaymentController = require('../../controllers/userPaymentController');

router.route('/get').get(userPaymentController.getUserPayment);
router.route('/add').post(userPaymentController.addUserPayment);
router.route('/update').put(userPaymentController.updateUserPayment);
router.route('/delete').delete(userPaymentController.deleteUserPayment);

module.exports = router;
