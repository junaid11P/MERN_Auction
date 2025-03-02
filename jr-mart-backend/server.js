const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const connectDB = require('./config/db');
const mongoose = require('mongoose');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/JRmart', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/products', require('./routes/products'));
app.use('/orders', require('./routes/orders'));
app.use('/cart', require('./routes/cart'));

// Add this after your routes
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
app.post('/upload', upload.single('image'), (req, res) => {
    res.json({ file: req.file });
}
);
app.get('/images/:filename', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/images', req.params.filename));
});
app.post('/users', (req, res) => {
    res.json({ message: 'User created' });
});
app.get('/users', (req, res) => {
    res.json({ message: 'Users found' });
});
app.get('/products', (req, res) => {
    res.json({ message: 'Products found' });
});
app.post('/products', (req, res) => {
    res.json({ message: 'Product created' });
});
app.get('/orders', (req, res) => {
    res.json({ message: 'Orders found' });
});
app.post('/orders', (req, res) => {
    res.json({ message: 'Order created' });
});
app.get('/cart', (req, res) => {
    res.json({ message: 'Cart found' });
});
app.post('/cart', (req, res) => {
    res.json({ message: 'Cart updated' });
});
app.delete('/cart', (req, res) => {
    res.json({ message: 'Cart cleared' });
});
app.get('/checkout', (req, res) => {
    res.json({ message: 'Checkout successful' });
});
app.get('/orders', (req, res) => {
    res.json({ message: 'Orders found' });
});
app.post('/orders', (req, res) => {
    res.json({ message: 'Order created' });
});
app.get('/orders/:id', (req, res) => {
    res.json({ message: 'Order found' });
});
app.patch('/orders/:id', (req, res) => {
    res.json({ message: 'Order updated' });
});
app.delete('/orders/:id', (req, res) => {
    res.json({ message: 'Order deleted' });
});
app.get('/users', (req, res) => {
    res.json({ message: 'Users found' });
});
app.post('/users', (req, res) => {
    res.json({ message: 'User created' });
});
app.get('/users/:id', (req, res) => {
    res.json({ message: 'User found' });
});
app.patch('/users/:id', (req, res) => {
    res.json({ message: 'User updated' });
});
app.delete('/users/:id', (req, res) => {
    res.json({ message: 'User deleted' });
});
app.get('/products', (req, res) => {
    res.json({ message: 'Products found' });
});
app.post('/products', (req, res) => {
    res.json({ message: 'Product created' });
});
app.get('/products/:id', (req, res) => {
    res.json({ message: 'Product found' });
});
app.patch('/products/:id', (req, res) => {
    res.json({ message: 'Product updated' });
});
app.delete('/products/:id', (req, res) => {
    res.json({ message: 'Product deleted' });
});
app.get('/cart', (req, res) => {
    res.json({ message: 'Cart found' });
});
app.post('/cart', (req, res) => {
    res.json({ message: 'Cart updated' });
});
app.delete('/cart', (req, res) => {
    res.json({ message: 'Cart cleared' });
});
app.get('/checkout', (req, res) => {
    res.json({ message: 'Checkout successful' });
});
app.get('/orders', (req, res) => {
    res.json({ message: 'Orders found' });
});
app.post('/orders', (req, res) => {
    res.json({ message: 'Order created' });
});
app.get('/orders/:id', (req, res) => {
    res.json({ message: 'Order found' });
});
app.patch('/orders/:id', (req, res) => {
    res.json({ message: 'Order updated' });
});
app.delete('/orders/:id', (req, res) => {
    res.json({ message: 'Order deleted' });
});
// Start server
const PORT = process.env.PORT || 3001;  

app.listen(3001, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Server error:', err);
});