const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  cardNumber: {
    type: String,
    required: true,
    unique: true,
  },
  balanceAmount: {
    type: Number,
    default: 0,
  },
  customerNumber: {
    type: String,
  },
});

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
