const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');

// Configure multer for image upload
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
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create product
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { name, category, price, description, sellerId } = req.body;
        
        const product = new Product({
            name,
            category,
            price,
            description,
            image: `/images/${req.file.filename}`,
            sellerId
        });

        await product.save();
        res.status(201).json({ 
            success: true, 
            message: 'Product created successfully',
            product 
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Error creating product'
        });
    }
});

module.exports = router;