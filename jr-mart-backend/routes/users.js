const express = require('express');
const router = express.Router();
const User = require('../models/User');

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

module.exports = router;