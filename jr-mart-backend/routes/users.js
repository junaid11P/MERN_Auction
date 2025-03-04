const express = require('express');
const router = express.Router();
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/qrcodes/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            cb(new Error('Invalid file type'), false);
            return;
        }
        cb(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

// Add login route
router.post('/login', async (req, res) => {
    try {
        const { email, password, userType } = req.body;
        
        // Find user by email and userType
        const user = await User.findOne({ email, userType });
        
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        
        // Check password (In production, use bcrypt.compare)
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        res.json({
            success: true,
            user: userResponse
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { email } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create new user
        const user = new User(req.body);
        await user.save();

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            user: userResponse
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false,
            message: error.message || 'Error registering user'
        });
    }
});

// Add this route to get user details
router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Remove sensitive information
        const userResponse = user.toObject();
        delete userResponse.password;

        res.json({
            success: true,
            user: userResponse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch user data'
        });
    }
});

// Add this route to get seller payment details
router.get('/:userId/payment-details', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user || user.userType !== 'seller') {
            return res.status(404).json({
                success: false,
                message: 'Seller not found'
            });
        }

        res.json({
            success: true,
            paymentDetails: {
                upiId: user.paymentDetails?.upiId || null,
                qrCode: user.paymentDetails?.qrCode || null
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch seller payment details'
        });
    }
});

// Update user profile
router.patch('/:userId', async (req, res) => {
    try {
        const updates = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            updates,
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Remove sensitive information
        const userResponse = user.toObject();
        delete userResponse.password;

        res.json({
            success: true,
            user: userResponse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update user data'
        });
    }
});

module.exports = router;