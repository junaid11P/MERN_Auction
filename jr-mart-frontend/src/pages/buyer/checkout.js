import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
    const [cartItems, setCartItems] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shippingAddress, setShippingAddress] = useState('');
    const [useProfileAddress, setUseProfileAddress] = useState(true);
    const navigate = useNavigate();

    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        // Fetch cart items and buyer profile
        Promise.all([
            fetch('http://localhost:3001/cart'),
            fetch('http://localhost:3001/users/1') // Assuming buyer ID is 1
        ])
            .then(([cartRes, profileRes]) => Promise.all([cartRes.json(), profileRes.json()]))
            .then(([cartData, profileData]) => {
                setCartItems(cartData);
                setProfile(profileData);
                setShippingAddress(profileData.address);
                calculateTotal(cartData);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, []);

    const calculateTotal = (items) => {
        const total = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
        setTotalAmount(total);
    };

    const handleAddressChange = (e) => {
        setShippingAddress(e.target.value);
    };

    const handleUseProfileAddress = (e) => {
        setUseProfileAddress(e.target.checked);
        if (e.target.checked) {
            setShippingAddress(profile.address);
        } else {
            setShippingAddress('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Create order
            const orderResponse = await fetch('http://localhost:3001/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    buyerId: profile.id,
                    sellerId: 2, // Assuming single seller for simplicity
                    status: 'pending',
                    createdAt: new Date().toISOString(),
                    paymentStatus: 'pending',
                    deliveryAddress: shippingAddress,
                    amount: totalAmount
                })
            });

            if (!orderResponse.ok) throw new Error('Failed to create order');

            // Update profile with new address if different
            if (shippingAddress !== profile.address) {
                const profileResponse = await fetch(`http://localhost:3001/users/${profile.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...profile,
                        address: shippingAddress
                    })
                });

                if (!profileResponse.ok) throw new Error('Failed to update profile');
            }

            // Clear cart
            await Promise.all(cartItems.map(item => 
                fetch(`http://localhost:3001/cart/${item.id}`, { method: 'DELETE' })
            ));

            alert('Order placed successfully!');
            navigate('/buyer/orders');

        } catch (error) {
            console.error('Error processing order:', error);
            alert('Failed to process order. Please try again.');
        }
    };

    if (loading) return <div className="container my-4">Loading...</div>;

    return (
        <div className="container my-4">
            <h2 className="mb-4">Checkout</h2>
            <div className="row">
                <div className="col-md-8">
                    <div className="card mb-4">
                        <div className="card-header">
                            <h5 className="mb-0">Shipping Address</h5>
                        </div>
                        <div className="card-body">
                            <div className="form-check mb-3">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="useProfileAddress"
                                    checked={useProfileAddress}
                                    onChange={handleUseProfileAddress}
                                />
                                <label className="form-check-label" htmlFor="useProfileAddress">
                                    Use profile address
                                </label>
                            </div>
                            <div className="mb-3">
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={shippingAddress}
                                    onChange={handleAddressChange}
                                    placeholder="Enter shipping address"
                                    required
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">Order Summary</h5>
                        </div>
                        <div className="card-body">
                            {cartItems.map((item, index) => (
                                <div key={index} className="d-flex justify-content-between mb-2">
                                    <span>{item.productId} x {item.quantity || 1}</span>
                                    <span>₹{item.price * (item.quantity || 1)}</span>
                                </div>
                            ))}
                            <hr />
                            <div className="d-flex justify-content-between">
                                <strong>Total</strong>
                                <strong>₹{totalAmount}</strong>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Payment Details</h5>
                            <p className="card-text">Total Amount: ₹{totalAmount}</p>
                            <button 
                                className="btn btn-primary w-100"
                                onClick={handleSubmit}
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