const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.get('/initiate/:orderId', async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: 'Order not found' 
            });
        }

        // Here you would integrate with a payment gateway like Razorpay or Stripe
        // For now, we'll simulate a successful payment
        order.paymentStatus = 'completed';
        order.status = 'confirmed';
        await order.save();

        res.redirect(`http://localhost:3000/buyer/orders?success=true`);
    } catch (error) {
        console.error('Payment error:', error);
        res.redirect(`http://localhost:3000/buyer/orders?error=${error.message}`);
    }
});

module.exports = router;