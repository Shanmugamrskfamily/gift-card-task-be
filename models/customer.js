const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  customerNumber: {
    type: String,
    required: true,
    unique: true,
  },
  cardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card',
    required: true,
  },
  customerBalance: {
    type: Number,
    default: 0,
  },
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
