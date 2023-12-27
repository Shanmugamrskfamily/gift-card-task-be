const axios = require('axios');
const Card = require('../models/card.js');
const Customer = require('../models/customer.js');

const API_URL = 'https://etesting.space/wp-json/wc-pimwick/v1/pw-gift-cards';
const USERNAME = 'ck_ad713bc399f8d63da81a3583057b3e7b3d0899d4';
const PASSWORD = 'cs_ee0259074bde553ce2008e6e0cd3994f99da77d5';

const getGiftCard = async (req, res) => {
  try {
    const { giftCardNumber } = req.body;

    // Check if the gift card number already exists in the database
    const existingCard = await Card.findOne({ cardNumber: giftCardNumber });

    if (existingCard) {
      // Gift card number exists in the database, use the balance from the database
      const balanceAmount = existingCard.balanceAmount;
      res.status(200).json({ success: true, balance: balanceAmount, message: 'Gift card redeemed successfully' });
      return;
    }
    // Make API request to redeem gift card
    const response = await axios.post(
      API_URL,
      { gift_card_number: giftCardNumber },
      {
        auth: {
          username: USERNAME,
          password: PASSWORD,
        },
      }
    );
    if (response.status === 200) {
      if (!response.data.gift_card || response.data.gift_card === 0) {
        // Invalid card number, do not store data
        res.status(400).json({ success: false, message: 'Invalid Card Number... Please check' });
      } else {
        // Store response amount and gift card number in the Card model
        const card = new Card({
          cardNumber: giftCardNumber,
          balanceAmount: response.data.gift_card,
        });
        // Save the card to the database
        await card.save();
        res.status(200).json({ success: true, balance: response.data.gift_card, message: 'Gift card Data fetched successfully' });
      }
    } else {
      res.status(400).json({ success: false, message: 'Failed to get gift card' });
    }
  } catch (error) {
    console.log(error);
    console.error('Error fetching gift card:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const redeemGiftCardWithAmount = async (req, res) => {
  try {
    const { giftCardNumber, customerNumber, amount } = req.body;
    const existingCard = await Card.findOne({ cardNumber: giftCardNumber });
    
    if (!existingCard) {
      res.status(400).json({ success: false, message: 'Invalid Gift Card Number... Please check' });
      return;
    }

    if (amount > existingCard.balanceAmount) {
      res.status(400).json({ success: false, message: 'Amount to be redeemed exceeds the card balance' });
      return;
    }

    existingCard.balanceAmount -= amount;
    await existingCard.save();

    const customer = new Customer({
      customerNumber: customerNumber,
      redeemedAmount: amount,
      cardNumber: giftCardNumber,
    });

    await customer.save();

    res.status(200).json({ success: true, message: 'Gift card redeemed successfully', remainingBalance: existingCard.balanceAmount });
  } catch (error) {
    console.log(error);
    console.error('Error redeeming gift card with amount:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  getGiftCard, redeemGiftCardWithAmount
};
