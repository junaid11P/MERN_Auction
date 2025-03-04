import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateTracking() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState('');
    const [message, setMessage] = useState('');

    const statusOptions = [
        { value: 'order_placed', label: 'Order Placed' },
        { value: 'payment_verified', label: 'Payment Verified' },
        { value: 'processing', label: 'Processing' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'out_for_delivery', label: 'Out for Delivery' },
        { value: 'delivered', label: 'Delivered' }
    ];

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/orders/${orderId}`);
            if (!response.ok) throw new Error('Failed to fetch order details');
            
            const data = await response.json();
            setOrder(data.order);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3001/api/orders/${orderId}/tracking`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status, message })
            });

            if (!response.ok) throw new Error('Failed to update tracking');

            alert('Tracking updated successfully');
            window.dispatchEvent(new CustomEvent('orderStatusChanged'));
            navigate('/seller/recent-orders');
        } catch (error) {
            alert(error.message);
        }
    };

    if (loading) return <div className="container my-4">Loading...</div>;
    if (error) return <div className="container my-4 alert alert-danger">{error}</div>;
    if (!order) return <div className="container my-4">Order not found</div>;

    return (
        <div className="container my-4">
            <h2 className="mb-4">Update Order Tracking</h2>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Order #{orderId.slice(-6)}</h5>
                    <div className="mb-4">
                        <p><strong>Current Status:</strong> {order.status?.toUpperCase()}</p>
                        <div className="progress mb-3">
                            <div 
                                className="progress-bar" 
                                style={{ 
                                    width: `${
                                        order.status === 'order_placed' ? '20%' :
                                        order.status === 'payment_verified' ? '40%' :
                                        order.status === 'processing' ? '60%' :
                                        order.status === 'shipped' ? '80%' :
                                        '100%'
                                    }`
                                }}
                            />
                        </div>
                    </div>

                    <form onSubmit={handleUpdateStatus}>
                        <div className="mb-3">
                            <label className="form-label">Update Status</label>
                            <select 
                                className="form-select"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                required
                            >
                                <option value="">Select Status</option>
                                {statusOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Status Message</label>
                            <textarea
                                className="form-control"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                placeholder="Enter status message"
                                rows="3"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Update Tracking
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}