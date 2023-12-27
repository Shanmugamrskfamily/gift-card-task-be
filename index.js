const express = require('express');
const cors = require('cors');
require('dotenv').config(); 
const connectDB = require('./db/db.js');
const giftCardRoute = require('./routes/route.js');

const app = express();
const PORT = process.env.PORT || 5055;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use('/api', giftCardRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
