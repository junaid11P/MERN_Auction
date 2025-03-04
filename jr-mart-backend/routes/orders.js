const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: 'public/images/payments',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'payment-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

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
        const { sellerId } = req.params;
        console.log('Fetching orders for seller:', sellerId); // Debug log

        const orders = await Order.find({
            'products.sellerId': sellerId
        })
        .sort({ createdAt: -1 })
        .populate('userId', 'name email')
        .populate('products.productId');

        console.log('Found orders:', orders.length); // Debug log

        res.json({
            success: true,
            orders
        });
    } catch (error) {
        console.error('Error fetching seller orders:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch orders'
        });
    }
});

// Update the create order route
router.post('/', async (req, res) => {
    try {
        const { userId, products, shippingAddress, totalAmount, paymentMethod } = req.body;
        
        if (!userId || !products || !products.length || !shippingAddress || !totalAmount) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Create order with correct status values
        const order = new Order({
            userId,
            products,
            shippingAddress,
            totalAmount,
            paymentMethod,
            orderStatus: paymentMethod === 'cod' ? 'processing' : 'payment_pending',
            paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending'
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
            .populate('userId')
            .populate('products.productId');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found. Please check the order ID and try again.'
            });
        }

        res.json({
            success: true,
            order
        });
    } catch (error) {
        console.error('Order tracking error:', error);
        res.status(500).json({
            success: false,
            message: 'Invalid order ID format or server error'
        });
    }
});

// Update order status route
router.patch('/:orderId/status', async (req, res) => {
    try {
        const { orderId } = req.params;
        const { orderStatus, message } = req.body;

        // Validate status before updating
        const validStatuses = [
            'pending',
            'payment_pending',
            'payment_verified',
            'processing',
            'shipped',
            'out_for_delivery',
            'delivered',
            'cancelled'
        ];

        if (!validStatuses.includes(orderStatus)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid order status'
            });
        }

        const order = await Order.findByIdAndUpdate(
            orderId,
            {
                $set: { orderStatus },
                $push: {
                    trackingHistory: {
                        status: orderStatus,
                        message,
                        timestamp: new Date()
                    }
                }
            },
            { new: true }
        );

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

// Add payment verification route
router.patch('/:orderId/verify-payment', async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, message, verifiedBy } = req.body;

        // Update order status
        const order = await Order.findByIdAndUpdate(
            orderId,
            {
                $set: {
                    orderStatus: status,
                    paymentStatus: status === 'payment_verified' ? 'completed' : 'pending'
                },
                $push: {
                    trackingHistory: {
                        status,
                        message,
                        updatedBy: verifiedBy,
                        timestamp: new Date()
                    }
                }
            },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Update payment record
        if (status === 'payment_verified') {
            await Payment.findOneAndUpdate(
                { orderId: order._id },
                {
                    $set: {
                        status: 'completed',
                        verifiedBy,
                        verifiedAt: new Date()
                    }
                }
            );
        }

        res.json({
            success: true,
            order
        });
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to verify payment'
        });
    }
});

// Add payment proof submission route
router.post('/:orderId/payment-proof', upload.single('paymentProof'), async (req, res) => {
    try {
        const { orderId } = req.params;
        const { utrNumber } = req.body;
        const paymentProofPath = req.file ? `/uploads/${req.file.filename}` : null;

        const order = await Order.findByIdAndUpdate(
            orderId,
            {
                $set: {
                    utrNumber,
                    paymentProof: paymentProofPath,
                    orderStatus: 'payment_pending',
                    paymentStatus: 'pending_verification'
                },
                $push: {
                    trackingHistory: {
                        status: 'payment_pending',
                        message: 'Payment proof submitted, waiting for verification',
                        timestamp: new Date()
                    }
                }
            },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            order,
            message: 'Payment proof submitted successfully'
        });

    } catch (error) {
        console.error('Payment proof submission error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to submit payment proof'
        });
    }
});

// Add this route for updating tracking status
router.patch('/:orderId/tracking', async (req, res) => {
    try {
        const { status, message } = req.body;
        
        const order = await Order.findByIdAndUpdate(
            req.params.orderId,
            {
                $set: { status },
                $push: {
                    trackingStatus: {
                        status,
                        message,
                        timestamp: new Date()
                    }
                }
            },
            { new: true }
        );

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
            message: error.message
        });
    }
});

router.patch('/:orderId/payment-verification', async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, paymentStatus, message } = req.body;

        const order = await Order.findByIdAndUpdate(
            orderId,
            {
                $set: {
                    status,
                    paymentStatus,
                    rejectedAt: status === 'payment_rejected' ? new Date() : undefined
                },
                $push: {
                    trackingHistory: {
                        status,
                        message,
                        timestamp: new Date()
                    }
                }
            },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // If payment is rejected, notify the buyer
        if (status === 'payment_rejected') {
            // You can implement email notification here
            // await sendPaymentRejectionEmail(order.userId, order._id, message);
        }

        res.json({
            success: true,
            order,
            message: status === 'payment_verified' ? 
                'Payment verified successfully' : 
                'Payment rejected successfully'
        });

    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update payment status'
        });
    }
});

// Add new route for rejecting incomplete payment submissions
router.patch('/:orderId/reject-incomplete-payment', async (req, res) => {
    try {
        const { orderId } = req.params;
        const { reason } = req.body;

        const order = await Order.findByIdAndUpdate(
            orderId,
            {
                $set: {
                    orderStatus: 'payment_rejected',
                    paymentStatus: 'failed',
                    rejectedReason: reason,
                    rejectedAt: new Date()
                },
                $push: {
                    trackingHistory: {
                        status: 'payment_rejected',
                        message: `Payment rejected: ${reason}`,
                        timestamp: new Date()
                    }
                }
            },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            order,
            message: 'Payment rejected successfully'
        });

    } catch (error) {
        console.error('Payment rejection error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to reject payment'
        });
    }
});

module.exports = router;