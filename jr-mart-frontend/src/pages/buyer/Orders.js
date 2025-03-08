import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user?._id) {
                    navigate('/login');
                    return;
                }

                const response = await fetch(`http://localhost:3001/api/orders/user/${user._id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }

                const data = await response.json();
                setOrders(data.orders);
            } catch (error) {
                console.error('Error:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);

    useEffect(() => {
        const handleStatusChange = () => {
            const fetchUpdatedOrders = async () => {
                try {
                    const user = JSON.parse(localStorage.getItem('user'));
                    const response = await fetch(`http://localhost:3001/api/orders/user/${user._id}`);
                    if (!response.ok) throw new Error('Failed to fetch orders');
                    
                    const data = await response.json();
                    setOrders(data.orders);
                } catch (error) {
                    console.error('Error refreshing orders:', error);
                }
            };

            fetchUpdatedOrders();
        };

        window.addEventListener('orderStatusChanged', handleStatusChange);
        return () => window.removeEventListener('orderStatusChanged', handleStatusChange);
    }, []);

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/api/orders/${orderId}/cancel`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to cancel order');
            }

            // Refresh orders list
            const user = JSON.parse(localStorage.getItem('user'));
            const ordersResponse = await fetch(`http://localhost:3001/api/orders/user/${user._id}`);
            const data = await ordersResponse.json();
            setOrders(data.orders);

            alert('Order cancelled successfully');
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Failed to cancel order');
        }
    };

    const getStatusBadgeClass = (status) => {
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

    if (loading) return <div className="container my-4">Loading...</div>;
    if (error) return <div className="container my-4 alert alert-danger">{error}</div>;

    return (
        <div className="container my-4">
            <h2 className="mb-4">My Orders</h2>
            {orders.length === 0 ? (
                <div className="alert alert-info">No orders found</div>
            ) : (
                orders.map(order => (
                    <div key={order._id} className="card mb-3">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <span className="me-2">Order #</span>
                                <code className="me-2">{order._id}</code>
                                <button
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => {
                                        navigator.clipboard.writeText(order._id);
                                        alert('Order ID copied to clipboard!');
                                    }}
                                    title="Copy Order ID"
                                >
                                    <i className="bi bi-clipboard"></i>
                                </button>
                            </div>
                            <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                                {(order.status || 'pending').toUpperCase()}
                            </span>
                        </div>
                        <div className="card-body">
                            {order.products.map(item => (
                                <div key={item.productId._id} className="d-flex mb-3">
                                    <img
                                        src={`http://localhost:3001${item.productId.image}`}
                                        alt={item.productId.name}
                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                        className="me-3"
                                    />
                                    <div>
                                        <h6>{item.productId.name}</h6>
                                        <p className="mb-1">Quantity: {item.quantity}</p>
                                        <p className="mb-0">Price: ₹{item.price * item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                            <hr />
                            <div className="row">
                                <div className="col-md-6">
                                    <p className="mb-1"><strong>Shipping Address:</strong></p>
                                    <p className="mb-0">{order.shippingAddress}</p>
                                </div>
                                <div className="col-md-6 text-md-end">
                                    <p className="mb-1">
                                        <strong>Payment Method:</strong> Cash on Delivery
                                    </p>
                                    <p className="mb-0">
                                        <strong>Total Amount:</strong> ₹{order.totalAmount}
                                    </p>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <div className="progress flex-grow-1 me-3" style={{ height: '20px' }}>
                                    <div 
                                        className={`progress-bar ${
                                            order.status === 'cancelled' ? 'bg-danger' :
                                            order.status === 'confirmed' ? 'bg-success' :
                                            'bg-primary'
                                        }`}
                                        role="progressbar"
                                        style={{ 
                                            width: `${
                                                order.status === 'pending' ? '25%' :
                                                order.status === 'confirmed' ? '50%' :
                                                order.status === 'shipped' ? '75%' :
                                                order.status === 'delivered' ? '100%' :
                                                '100%'
                                            }`
                                        }}
                                    >
                                        {(order.status || 'pending').toUpperCase()}
                                    </div>
                                </div>
                                <div>
                                    <Link 
                                        to={`/buyer/track-order/${order._id}`}
                                        className="btn btn-info btn-sm me-2"
                                    >
                                        Track Order
                                    </Link>
                                    {['pending', 'payment_pending'].includes(order.status) && (
                                        <button 
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleCancelOrder(order._id)}
                                        >
                                            Cancel Order
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}