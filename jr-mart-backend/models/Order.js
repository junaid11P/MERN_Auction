const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    shippingAddress: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['cod', 'online']
    },
    paymentStatus: {
        type: String,
        enum: [
            'pending',
            'pending_verification',
            'completed',
            'failed'
        ],
        default: 'pending'
    },
    orderStatus: {
        type: String,
        enum: [
            'pending',
            'payment_pending',
            'payment_verified',
            'processing',
            'shipped',
            'out_for_delivery',
            'delivered',
            'cancelled'
        ],
        default: 'pending'
    },
    utrNumber: String,
    paymentProof: String,
    trackingHistory: [{
        status: String,
        message: String,
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    trackingStatus: {
        type: [{
            status: String,
            message: String,
            timestamp: {
                type: Date,
                default: Date.now
            }
        }],
        default: [] // Initialize as empty array
    },
    rejectedReason: {
        type: String
    },
    rejectedAt: {
        type: Date
    }
}, { timestamps: true });

// Generate unique order ID before saving
orderSchema.pre('save', async function(next) {
    if (!this.orderId) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const count = await this.constructor.countDocuments();
        this.orderId = `JR${year}${month}${count.toString().padStart(4, '0')}`;
    }
    next();
});

// Add pre-save middleware to add initial tracking status
orderSchema.pre('save', function(next) {
    if (this.isNew) {
        this.trackingStatus = [{
            status: this.orderStatus,
            message: 'Order created',
            timestamp: new Date()
        }];
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);