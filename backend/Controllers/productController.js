const Product = require('../Models/Product');
const fs = require('fs');
const path = require('path');

exports.createProduct = async (req, res) => {
  try {
    const { name, price } = req.body;
    let imageUrl = null;
    if (req.file) {
      imageUrl = req.file.path.replace(/\\/g, "/"); // normalize slashes for windows
    }
    const product = new Product({ name, price, imageUrl });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, price } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Delete old image if new one uploaded
    if (req.file && product.imageUrl) {
      fs.unlink(path.join(__dirname, '..', product.imageUrl), err => {
        if (err) console.error('Image deletion error:', err);
      });
      product.imageUrl = req.file.path.replace(/\\/g, "/");
    }

    product.name = name;
    product.price = price;
    await product.save();

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Delete image file
    if (product.imageUrl) {
      fs.unlink(path.join(__dirname, '..', product.imageUrl), err => {
        if (err) console.error('Image deletion error:', err);
      });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
