const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller.js');


router.post('/get-gift-card', controller.getGiftCard);
router.put('/redeem-gift-card',controller.redeemGiftCardWithAmount);

module.exports = router;