const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');

// Get all orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get orders by seller ID
router.get('/seller/:sellerId', async (req, res) => {
    try {
        const orders = await Order.find({ 'products.sellerId': req.params.sellerId })
            .populate('products.productId userId')
            .sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Create order
router.post('/', async (req, res) => {
    try {
        // Create the order
        const order = new Order(req.body);
        await order.save();

        // Clear the user's cart after successful order creation
        await Cart.findOneAndUpdate(
            { userId: req.body.userId },
            { $set: { products: [] } }
        );

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order
        });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create order'
        });
    }
});

// Get user's orders
router.get('/user/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId })
            .populate('products.productId')
            .sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch orders'
        });
    }
});

// Update order status
router.patch('/:orderId/status', async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.orderId,
            { status },
            { new: true }
        );
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update order status'
        });
    }
});

module.exports = router;