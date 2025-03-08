import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function TrackOrder() {
    const { orderId: routeOrderId } = useParams();
    const [orderId, setOrderId] = useState(routeOrderId || '');
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleTrackOrder = async (e, trackOrderId = orderId) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError(null);

        // Remove the '#' if present and trim any whitespace
        const cleanOrderId = trackOrderId.replace('#', '').trim();

        try {
            const response = await fetch(`http://localhost:3001/api/orders/${cleanOrderId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Order not found');
            }

            if (!data.order) {
                throw new Error('Order details not available');
            }

            setOrderDetails(data.order);
        } catch (error) {
            console.error('Tracking error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Auto-fetch if order ID is provided in route
    useEffect(() => {
        if (routeOrderId) {
            handleTrackOrder(null, routeOrderId);
        }
    }, [routeOrderId]);

    const getStatusClass = (status) => {
        switch(status) {
            case 'pending':
                return 'bg-warning';
            case 'confirmed':
                return 'bg-success';
            case 'shipped':
                return 'bg-primary';
            case 'delivered':
                return 'bg-success';
            case 'cancelled':
                return 'bg-danger';
            default:
                return 'bg-secondary';
        }
    };

    return (
        <div className="container my-4">
            <h2 className="mb-4">Track Your Order</h2>
            <div className="row">
                <div className="col-md-6">
                    <div className="card mb-4">
                        <div className="card-body">
                            <form onSubmit={handleTrackOrder}>
                                <div className="mb-3">
                                    <label className="form-label">Order ID</label>
                                    <div className="input-group">
                                        <span className="input-group-text">#</span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={orderId}
                                            onChange={(e) => setOrderId(e.target.value)}
                                            required
                                            placeholder="Enter order ID (e.g., 67c6cb555bdaf87917f313a0)"
                                        />
                                    </div>
                                    <small className="text-muted">
                                        Enter the order ID without the # symbol
                                    </small>
                                </div>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" />
                                            Tracking...
                                        </>
                                    ) : 'Track Order'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {error && (
                        <div className="alert alert-danger">
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            {error}
                        </div>
                    )}
                </div>

                {orderDetails && (
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">
                                    Order #{orderDetails._id.slice(-6)}
                                </h5>
                                <div className="tracking-timeline mt-4">
                                    {orderDetails.trackingStatus?.map((status, index) => (
                                        <div key={index} className="tracking-item">
                                            <div className={`tracking-status ${getStatusClass(status.status)}`}>
                                                {status.status.replace(/_/g, ' ').toUpperCase()}
                                            </div>
                                            <div className="tracking-time">
                                                {new Date(status.timestamp).toLocaleString()}
                                            </div>
                                            <div className="tracking-message">
                                                {status.message}
                                            </div>
                                        </div>
                                    ))}
                                    {(!orderDetails.trackingStatus || 
                                      orderDetails.trackingStatus.length === 0) && (
                                        <div className="alert alert-info">
                                            No tracking updates available yet
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}