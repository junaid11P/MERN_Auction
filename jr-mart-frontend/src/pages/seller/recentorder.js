import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RecentOrder() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, [navigate]); // Add navigate as dependency

    const fetchOrders = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user?._id || user.userType !== 'seller') {
                navigate('/login');
                return;
            }

            const response = await fetch(`http://localhost:3001/api/orders/seller/${user._id}`);
            if (!response.ok) throw new Error('Failed to fetch orders');

            const data = await response.json();
            setOrders(data.orders || []);
            setLoading(false);
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
            setLoading(false);
        }
    };

    if (loading) return <div className="container my-4">Loading...</div>;
    if (error) return <div className="container my-4 alert alert-danger">{error}</div>;

    return (
        <div className="container my-4">
            <h2 className="mb-4">Recent Orders</h2>
            <div className="row">
                {orders.map(order => (
                    <div key={order._id} className="col-md-6 mb-4">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">Order #{order._id.slice(-6)}</h5>
                            </div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                                    <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
                                    
                                    <div className="shipping-details mb-3">
                                        <h6>Shipping Address</h6>
                                        <p className="mb-1">{order.shippingAddress}</p>
                                    </div>

                                    <p><strong>Status:</strong> 
                                        <span className={`badge ms-2 ${
                                            order.status === 'pending' ? 'bg-warning' :
                                            order.status === 'confirmed' ? 'bg-success' :
                                            order.status === 'shipped' ? 'bg-primary' :
                                            order.status === 'delivered' ? 'bg-success' :
                                            'bg-secondary'
                                        }`}>
                                            {(order.status || 'pending').toUpperCase()}
                                        </span>
                                    </p>
                                </div>
                                <button 
                                    className="btn btn-primary btn-sm"
                                    onClick={() => navigate(`/seller/update-tracking/${order._id}`)}
                                >
                                    Update Tracking
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {orders.length === 0 && (
                    <div className="col">
                        <p className="text-muted">No recent orders found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}