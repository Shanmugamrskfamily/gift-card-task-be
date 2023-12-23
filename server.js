// server.js
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const app = express();
require('dotenv').config();

app.use(express.json());

const DBURI= process.env.DB_URI;
const PORT= process.env.PORT||4500;

mongoose.connect(DBURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Gift card model
const giftCardSchema = new mongoose.Schema({
  customerNumber: String,
  cardNumber: String,
  balance: Number,
});

const GiftCard = mongoose.model('GiftCard', giftCardSchema);

// Routes
app.get('/validateGiftCard/:giftCardNumber', async (req, res) => {
  try {
    const giftCardNumber = req.params.giftCardNumber;
    const endpoint = 'https://etesting.space/wp-json/wc-pimwick/v1/pw-gift-cards';
    const auth = {
      username: 'ck_ad713bc399f8d63da81a3583057b3e7b3d0899d4',
      password: 'cs_ee0259074bde553ce2008e6e0cd3994f99da77d5',
    };

    const response = await axios.get(`${endpoint}/${giftCardNumber}`, { auth });
    console.log(`Response: ${response}`);
    const isValid = response.data.valid;
    const balance = isValid ? response.data.balance : null;

    res.json({ isValid, balance });
  } catch (error) {
    // console.error('Error validating gift card:', error);
    console.log('Error: ',error)
    res.status(500).json({ isValid: false, balance: null, error: 'Gift Card Not Found!' });
  }
});

app.post('/applyPayment', async (req, res) => {
  try {
    const { customerNumber, cardNumber, balance } = req.body;
    const giftCard = new GiftCard({ customerNumber, cardNumber, balance });
    await giftCard.save();
    res.json({ message: 'Payment applied successfully' });
  } catch (error) {
    console.error('Error applying payment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});