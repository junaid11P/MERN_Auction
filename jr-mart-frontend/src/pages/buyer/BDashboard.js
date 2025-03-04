import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function BDashboard() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user?._id || user.userType !== 'buyer') {
                    navigate('/login');
                    return;
                }

                const [productsRes, cartRes, ordersRes] = await Promise.all([
                    fetch('http://localhost:3001/api/products'),
                    fetch(`http://localhost:3001/api/cart/${user._id}`),
                    fetch(`http://localhost:3001/api/orders/user/${user._id}/recent`)
                ]);

                if (!productsRes.ok) throw new Error('Failed to fetch products');
                if (!cartRes.ok) throw new Error('Failed to fetch cart');
                if (!ordersRes.ok) throw new Error('Failed to fetch orders');

                const [productsData, cartData, ordersData] = await Promise.all([
                    productsRes.json(),
                    cartRes.json(),
                    ordersRes.json()
                ]);

                setProducts(productsData.products || []);
                setCartCount(cartData.cart?.products?.length || 0);
                setRecentOrders(ordersData.orders || []);
            } catch (error) {
                console.error('Error:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const addToCart = async (product) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user?._id) {
                navigate('/login');
                return;
            }

            const response = await fetch('http://localhost:3001/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user._id,
                    productId: product._id,
                    quantity: 1
                })
            });

            if (!response.ok) {
                throw new Error('Failed to add to cart');
            }

            const data = await response.json();
            setCartCount(data.cart.products.length);
            alert('Added to cart!');
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert(error.message || 'Failed to add item to cart');
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'pending': return 'bg-warning';
            case 'confirmed': return 'bg-info';
            case 'shipped': return 'bg-primary';
            case 'delivered': return 'bg-success';
            case 'cancelled': return 'bg-danger';
            default: return 'bg-secondary';
        }
    };

    if (loading) return <div className="container my-4">Loading...</div>;
    if (error) return <div className="container my-4 alert alert-danger">{error}</div>;

    return (
        <div className="container my-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Add items to the cart</h2>
                <button 
                    className="btn btn-outline-primary d-flex align-items-center"
                    onClick={() => navigate('/buyer/cart')}
                >
                    <img src="/cart4.svg" alt="cart" width="24" className="me-2" />
                    Cart ({cartCount})
                </button>
            </div>
            <div className="row">
                {products.map(product => (
                    <div key={product._id} className="col-md-4 mb-4">
                        <div className="card h-100">
                            <img 
                                src={`http://localhost:3001${product.image}`}
                                className="card-img-top"
                                alt={product.name}
                                style={{ height: '200px', objectFit: 'cover' }}
                                onError={(e) => {
                                    e.target.src = '/placeholder.jpg';
                                }}
                            />
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text">{product.description}</p>
                                <p className="card-text">₹{product.price}</p>
                                <button 
                                    className="btn btn-primary mt-auto d-flex align-items-center justify-content-center"
                                    onClick={() => addToCart(product)}
                                >
                                    <img src="/cart4.svg" alt="cart" width="20" className="me-2" />
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {products.length === 0 && (
                    <div className="col">
                        <div className="alert alert-info">
                            No products available at the moment.
                        </div>
                    </div>
                )}
            </div>
            <div className="mt-5">
                <h3 className="mb-4">Recent Orders</h3>
                {recentOrders.length > 0 ? (
                    <div className="row">
                        {recentOrders.map(order => (
                            <div key={order._id} className="col-md-4 mb-4">
                                <div className="card">
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                        <span>Order #{order._id.slice(-6)}</span>
                                        <span className={`badge ${getStatusBadgeClass(order.orderStatus)}`}>
                                            {order.orderStatus.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="card-body">
                                        <p className="mb-1">
                                            <strong>Total:</strong> ₹{order.totalAmount}
                                        </p>
                                        <p className="mb-1">
                                            <strong>Items:</strong> {order.products.length}
                                        </p>
                                        <p className="mb-1">
                                            <strong>Payment:</strong>{' '}
                                            <span className={`badge ${
                                                order.paymentStatus === 'completed' ? 'bg-success' :
                                                order.paymentStatus === 'pending' ? 'bg-warning' :
                                                'bg-danger'
                                            }`}>
                                                {order.paymentStatus.toUpperCase()}
                                            </span>
                                        </p>
                                        <p className="mb-3">
                                            <strong>Date:</strong>{' '}
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                        <button
                                            className="btn btn-outline-primary btn-sm w-100"
                                            onClick={() => navigate(`/buyer/orders`)}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="alert alert-info">
                        No orders found. Start shopping to place your first order!
                    </div>
                )}
                {recentOrders.length > 3 && (
                    <div className="text-center">
                        <button
                            className="btn btn-outline-primary"
                            onClick={() => navigate('/buyer/orders')}
                        >
                            View All Orders
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}