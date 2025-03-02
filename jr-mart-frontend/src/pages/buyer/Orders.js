import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
                            <span>Order #{order._id.slice(-6)}</span>
                            <span className={`badge ${
                                order.status === 'pending' ? 'bg-warning' :
                                order.status === 'confirmed' ? 'bg-info' :
                                order.status === 'shipped' ? 'bg-primary' :
                                order.status === 'delivered' ? 'bg-success' :
                                'bg-danger'
                            }`}>
                                {order.status.toUpperCase()}
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
                                        <strong>Payment Method:</strong> {order.paymentMethod.toUpperCase()}
                                    </p>
                                    <p className="mb-1">
                                        <strong>Payment Status:</strong>{' '}
                                        <span className={`badge ${
                                            order.paymentStatus === 'pending' ? 'bg-warning' :
                                            order.paymentStatus === 'completed' ? 'bg-success' :
                                            'bg-danger'
                                        }`}>
                                            {order.paymentStatus.toUpperCase()}
                                        </span>
                                    </p>
                                    <p className="mb-0">
                                        <strong>Total Amount:</strong> ₹{order.totalAmount}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}