const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String }, // store image path
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // optional, for auth
});

module.exports = mongoose.model('Product', productSchema);
