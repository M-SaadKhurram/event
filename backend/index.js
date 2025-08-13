const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

require('./Models/db.js');

app.use(cors());
app.use(express.json());

// Serve uploads folder statically so images are accessible
app.use('/uploads', express.static('uploads'));

// Routers
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');

app.use('/api/auth', AuthRouter);
app.use('/products', ProductRouter);

app.get('/ping', (req, res) => {
  res.send('PONG');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
