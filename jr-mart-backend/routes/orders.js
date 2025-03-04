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
        // Validate required fields
        const { userId, products, shippingAddress, totalAmount, paymentMethod } = req.body;
        
        if (!userId || !products || !products.length || !shippingAddress || !totalAmount) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Create order
        const order = new Order({
            userId,
            products,
            shippingAddress,
            totalAmount,
            paymentMethod,
            orderStatus: paymentMethod === 'cod' ? 'confirmed' : 'pending',
            paymentStatus: paymentMethod === 'cod' ? 'pending' : 'processing'
        });

        await order.save();

        // Clear cart after successful order creation
        await Cart.findOneAndUpdate(
            { userId },
            { $set: { products: [] } }
        );

        res.status(201).json({
            success: true,
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

        res.json({
            success: true,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch orders'
        });
    }
});

// Update the get recent orders route to include more details
router.get('/user/:userId/recent', async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId })
            .populate('products.productId')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            success: true,
            orders
        });
    } catch (error) {
        console.error('Fetch recent orders error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch recent orders'
        });
    }
});

// Get order by ID
router.get('/:orderId', async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId)
            .populate('products.productId')
            .populate('products.sellerId', 'name email');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch order'
        });
    }
});

// Update order status route
router.patch('/:orderId/status', async (req, res) => {
    try {
        const { status, orderStatus } = req.body;
        
        // Find and update both status and orderStatus
        const order = await Order.findByIdAndUpdate(
            req.params.orderId,
            { 
                $set: { 
                    status: status,
                    orderStatus: orderStatus 
                }
            },
            { new: true }
        ).populate('products.productId userId');
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({ 
            success: true, 
            order,
            message: 'Order status updated successfully'
        });
    } catch (error) {
        console.error('Order status update error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update order status'
        });
    }
});

// Add route to cancel order
router.patch('/:orderId/cancel', async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (['delivered', 'cancelled'].includes(order.orderStatus)) {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel this order'
            });
        }

        order.orderStatus = 'cancelled';
        await order.save();

        res.json({
            success: true,
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to cancel order'
        });
    }
});

module.exports = router;