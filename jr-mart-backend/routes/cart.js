const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// Get cart
router.get('/', async (req, res) => {
    try {
        const cart = await Cart.find();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update cart
router.post('/', async (req, res) => {
    try {
        const cart = new Cart(req.body);
        const newCart = await cart.save();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;