import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SDashboard() {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchData = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user?._id || user.userType !== 'seller') {
                navigate('/login');
                return;
            }

            const [productsRes, ordersRes] = await Promise.all([
                fetch(`http://localhost:3001/api/products/seller/${user._id}`),
                fetch(`http://localhost:3001/api/orders/seller/${user._id}`)
            ]);

            if (!productsRes.ok || !ordersRes.ok) {
                throw new Error('Failed to fetch data');
            }

            const [productsData, ordersData] = await Promise.all([
                productsRes.json(),
                ordersRes.json()
            ]);

            setProducts(productsData.products || []);
            setOrders(ordersData.orders || []);
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [fetchData, navigate]);

    const handleDelete = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/api/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setProducts(products.filter(product => product._id !== productId));
                alert('Product deleted successfully');
            } else {
                const data = await response.json();
                throw new Error(data.message || 'Failed to delete product');
            }
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Failed to delete product');
        }
    };

    if (loading) return <div className="container my-4">Loading...</div>;
    if (error) return <div className="container my-4 alert alert-danger">{error}</div>;

    return (
        <div className="container my-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Seller Dashboard</h2>
                <button 
                    className="btn btn-primary"
                    onClick={() => navigate('/seller/CreateProduct')}
                >
                    Add New Product
                </button>
            </div>

            <div className="row">
                <div className="col-md-8">
                    <h3 className="mb-3">Your Products</h3>
                    <div className="row">
                        {products.map(product => (
                            <div key={product._id} className="col-md-6 mb-4">
                                <div className="card h-100 shadow-sm">
                                    <img 
                                        src={`http://localhost:3001${product.image}`}
                                        className="card-img-top"
                                        alt={product.name}
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{product.name}</h5>
                                        <p className="card-text text-muted">{product.category}</p>
                                        <p className="card-text">₹{product.price}</p>
                                        <div className="d-flex gap-2">
                                            <button 
                                                className="btn btn-outline-primary"
                                                onClick={() => navigate(`/seller/EditProduct/${product._id}`)}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="btn btn-outline-danger"
                                                onClick={() => handleDelete(product._id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {products.length === 0 && (
                            <div className="col">
                                <p className="text-muted">No products yet. Add your first product!</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-md-4">
                    <h3 className="mb-3">Recent Orders</h3>
                    {orders.map(order => (
                        <div key={order._id} className="card mb-3 shadow-sm">
                            <div className="card-body">
                                <h6 className="mb-2">Order #{order._id.slice(-6)}</h6>
                                <p className="mb-1">Items: {order.products.length}</p>
                                <p className="mb-1">Total: ₹{order.totalAmount}</p>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className={`badge ${
                                        order.status === 'pending' ? 'bg-warning' :
                                        order.status === 'confirmed' ? 'bg-success' :
                                        order.status === 'shipped' ? 'bg-primary' :
                                        order.status === 'delivered' ? 'bg-success' :
                                        'bg-secondary'
                                    }`}>
                                        {(order.status || 'pending').toUpperCase()}
                                    </span>
                                </div>
                                <button 
                                    className="btn btn-primary btn-sm"
                                    onClick={() => navigate(`/seller/update-tracking/${order._id}`)}
                                >
                                    Update Tracking
                                </button>
                            </div>
                        </div>
                    ))}
                    {orders.length === 0 && (
                        <p className="text-muted">No orders yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}