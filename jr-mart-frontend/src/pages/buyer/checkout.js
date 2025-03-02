import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
    const [cartItems, setCartItems] = useState([]);
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [shippingAddress, setShippingAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const navigate = useNavigate();
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        fetchCheckoutData();
    }, [navigate]);

    const fetchCheckoutData = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user?._id || user.userType !== 'buyer') {
                navigate('/login');
                return;
            }

            setLoading(true);
            setError(null);

            // First, fetch cart data
            const cartResponse = await fetch(`http://localhost:3001/api/cart/${user._id}`, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (!cartResponse.ok) {
                throw new Error('Failed to fetch cart data');
            }

            const cartData = await cartResponse.json();

            if (!cartData.cart?.products?.length) {
                navigate('/buyer/cart');
                return;
            }

            // Then fetch product details for cart items
            const productIds = cartData.cart.products.map(item => item.productId);
            const productsResponse = await fetch('http://localhost:3001/api/products/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productIds })
            });

            if (!productsResponse.ok) {
                throw new Error('Failed to fetch product details');
            }

            const productsData = await productsResponse.json();
            const productsMap = productsData.products.reduce((acc, product) => {
                acc[product._id] = product;
                return acc;
            }, {});

            // Finally fetch user data for shipping address
            const userResponse = await fetch(`http://localhost:3001/api/users/${user._id}`, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (!userResponse.ok) {
                throw new Error('Failed to fetch user data');
            }

            const userData = await userResponse.json();

            setCartItems(cartData.cart.products);
            setProducts(productsMap);
            setShippingAddress(userData.user?.address || '');

            // Calculate total after setting products
            const total = cartData.cart.products.reduce((sum, item) => {
                const product = productsMap[item.productId];
                return sum + (product?.price || 0) * item.quantity;
            }, 0);
            setTotalAmount(total);

        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = (items, productsMap) => {
        const total = items.reduce((sum, item) => {
            const product = productsMap[item.productId];
            return sum + (product?.price || 0) * item.quantity;
        }, 0);
        setTotalAmount(total);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user?._id) {
                navigate('/login');
                return;
            }

            if (!shippingAddress.trim()) {
                alert('Please enter shipping address');
                return;
            }

            // Create order
            const orderResponse = await fetch('http://localhost:3001/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user._id,
                    products: cartItems.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: products[item.productId].price,
                        sellerId: products[item.productId].sellerId
                    })),
                    shippingAddress,
                    totalAmount,
                    paymentMethod,
                    status: 'pending',
                    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'processing'
                })
            });

            if (!orderResponse.ok) {
                throw new Error('Failed to create order');
            }

            const orderData = await orderResponse.json();

            if (paymentMethod === 'online') {
                // Redirect to payment gateway
                window.location.href = `http://localhost:3001/api/payment/initiate/${orderData.order._id}`;
                return;
            }

            // Clear cart for COD orders
            await fetch(`http://localhost:3001/api/cart/${user._id}/clear`, {
                method: 'DELETE'
            });

            alert('Order placed successfully!');
            navigate('/buyer/orders');
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Failed to place order');
        }
    };

    if (loading) return <div className="container my-4">Loading...</div>;
    if (error) return <div className="container my-4 alert alert-danger">{error}</div>;

    return (
        <div className="container my-4">
            <h2 className="mb-4">Checkout</h2>
            <div className="row">
                <div className="col-md-8">
                    <div className="card mb-4">
                        <div className="card-header">
                            <h5 className="mb-0">Order Items</h5>
                        </div>
                        <div className="card-body">
                            {cartItems.map((item) => {
                                const product = products[item.productId];
                                if (!product) return null;

                                return (
                                    <div key={item.productId} className="d-flex mb-3">
                                        <img
                                            src={`http://localhost:3001${product.image}`}
                                            alt={product.name}
                                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                            className="me-3"
                                        />
                                        <div>
                                            <h6>{product.name}</h6>
                                            <p className="mb-1">Quantity: {item.quantity}</p>
                                            <p className="mb-0">Price: ₹{product.price * item.quantity}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">Shipping Address</h5>
                        </div>
                        <div className="card-body">
                            <textarea
                                className="form-control"
                                rows="3"
                                value={shippingAddress}
                                onChange={(e) => setShippingAddress(e.target.value)}
                                placeholder="Enter shipping address"
                                required
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">Order Summary</h5>
                        </div>
                        <div className="card-body">
                            <div className="d-flex justify-content-between mb-3">
                                <span>Items Total:</span>
                                <span>₹{totalAmount}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3">
                                <span>Delivery:</span>
                                <span>Free</span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between mb-3">
                                <strong>Total:</strong>
                                <strong>₹{totalAmount}</strong>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="paymentMethod" className="form-label">Payment Method</label>
                                <select
                                    id="paymentMethod"
                                    className="form-select"
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                >
                                    <option value="cod">Cash on Delivery</option>
                                    <option value="online">Online Payment</option>
                                </select>
                            </div>
                            <button 
                                className="btn btn-primary w-100"
                                onClick={handleSubmit}
                                disabled={!shippingAddress.trim()}
                            >
                                Place Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}