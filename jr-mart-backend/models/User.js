const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        enum: ['buyer', 'seller'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    paymentDetails: {
        upiId: {
            type: String,
            trim: true
        },
        qrCode: {
            type: String
        }
    }
});

module.exports = mongoose.model('User', userSchema);