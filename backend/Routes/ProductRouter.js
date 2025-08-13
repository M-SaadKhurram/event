const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../Middlewares/Auth'); // your auth middleware
const productController = require('../Controllers/productController');
const upload = require('../Middlewares/upload');

// CRUD Routes with image upload
router.post('/', ensureAuthenticated, upload.single('image'), productController.createProduct);
router.get('/', ensureAuthenticated, productController.getProducts);
router.get('/:id', ensureAuthenticated, productController.getProductById);
router.put('/:id', ensureAuthenticated, upload.single('image'), productController.updateProduct);
router.delete('/:id', ensureAuthenticated, productController.deleteProduct);

module.exports = router;
