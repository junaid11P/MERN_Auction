const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
    try {
        const products = await Product.find({ 
            category: new RegExp(req.params.category, 'i') 
        });
        res.json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get products by seller
router.get('/seller/:sellerId', async (req, res) => {
    try {
        const products = await Product.find({ sellerId: req.params.sellerId });
        res.json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found' 
            });
        }
        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// Create product route
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { name, category, price, description, sellerId } = req.body;

        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'Image is required' 
            });
        }

        const product = new Product({
            name,
            category,
            price,
            description,
            sellerId,
            image: `/images/${req.file.filename}`
        });

        await product.save();

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product
        });
    } catch (error) {
        console.error('Product creation error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error creating product'
        });
    }
});

// Update product
router.patch('/:id', upload.single('image'), async (req, res) => {
    try {
        const updates = { ...req.body };
        if (req.file) {
            updates.image = `/images/${req.file.filename}`;
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Product updated successfully',
            product 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Product deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// Add this route to your existing products.js
router.post('/bulk', async (req, res) => {
    try {
        const { productIds } = req.body;
        const products = await Product.find({
            _id: { $in: productIds }
        });
        res.json({ success: true, products });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch products'
        });
    }
});

module.exports = router;