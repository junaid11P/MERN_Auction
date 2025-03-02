const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// Get user's cart
router.get('/:userId', async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.params.userId });
        
        if (!cart) {
            cart = await Cart.create({
                userId: req.params.userId,
                products: []
            });
        }

        res.json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch cart'
        });
    }
});

// Add to cart
router.post('/', async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, products: [] });
        }

        const existingProduct = cart.products.find(
            p => p.productId.toString() === productId
        );

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ productId, quantity });
        }

        await cart.save();
        res.json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to add to cart' });
    }
});

// Update quantity
router.patch('/:userId/product/:productId', async (req, res) => {
    try {
        const cart = await Cart.findOneAndUpdate(
            { 
                userId: req.params.userId,
                'products.productId': req.params.productId
            },
            {
                $set: {
                    'products.$.quantity': req.body.quantity
                }
            },
            { new: true }
        );

        res.json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update quantity'
        });
    }
});

// Remove from cart
router.delete('/:userId/product/:productId', async (req, res) => {
    try {
        const cart = await Cart.findOneAndUpdate(
            { userId: req.params.userId },
            {
                $pull: {
                    products: { productId: req.params.productId }
                }
            },
            { new: true }
        );

        res.json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Failed to remove item'
        });
    }
});

// Clear cart
router.delete('/:userId/clear', async (req, res) => {
    try {
        await Cart.findOneAndUpdate(
            { userId: req.params.userId },
            { $set: { products: [] } }
        );
        res.json({ success: true, message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Failed to clear cart' 
        });
    }
});

module.exports = router;