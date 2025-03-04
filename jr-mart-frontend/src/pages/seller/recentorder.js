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

    const handleVerifyPayment = async (orderId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/orders/${orderId}/verify-payment`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: 'payment_verified',
                    message: 'Payment verified by seller'
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to verify payment');
            }

            // Update local state and trigger refresh
            setOrders(orders.map(order => 
                order._id === orderId 
                    ? { ...order, status: 'payment_verified', paymentStatus: 'completed' } 
                    : order
            ));

            // Notify success
            alert('Payment verified successfully');

            // Dispatch event for buyer dashboard update
            window.dispatchEvent(new CustomEvent('orderStatusChanged'));
            
            // Refresh orders list
            fetchOrders();
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Failed to verify payment');
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
                                    <p><strong>Status:</strong> 
                                        <span className={`badge ms-2 ${
                                            order.status === 'pending' ? 'bg-warning' :
                                            order.status === 'payment_pending' ? 'bg-info' :
                                            order.status === 'payment_verified' ? 'bg-success' :
                                            'bg-secondary'
                                        }`}>
                                            {(order.status || 'pending').toUpperCase()}
                                        </span>
                                    </p>
                                </div>

                                {order.utrNumber && (
                                    <div className="payment-details border-top pt-3">
                                        <h6>Payment Details</h6>
                                        <p><strong>UTR Number:</strong> {order.utrNumber}</p>
                                        {order.paymentProof && (
                                            <div className="mb-3">
                                                <p><strong>Payment Screenshot:</strong></p>
                                                <img 
                                                    src={`http://localhost:3001${order.paymentProof}`}
                                                    alt="Payment Proof"
                                                    style={{ maxWidth: '200px' }}
                                                    className="img-thumbnail"
                                                />
                                            </div>
                                        )}
                                        {order.status !== 'payment_verified' && (
                                            <button 
                                                className="btn btn-success"
                                                onClick={() => handleVerifyPayment(order._id)}
                                            >
                                                Verify Payment
                                            </button>
                                        )}
                                    </div>
                                )}
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