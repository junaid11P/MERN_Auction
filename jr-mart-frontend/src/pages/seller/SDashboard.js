import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SDashboard() {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch seller's products
        fetch('http://localhost:3001/products')
            .then(res => res.json())
            .then(data => setProducts(data.filter(p => p.sellerId === 2))); // Replace with actual seller ID

        // Fetch seller's orders
        fetch('http://localhost:3001/orders')
            .then(res => res.json())
            .then(data => setOrders(data.filter(o => o.sellerId === 2))); // Replace with actual seller ID
    }, []);

    return (
        <div className="container my-4">
            <h2>Seller Dashboard</h2>
            <div className="row mb-4">
                <div className="col">
                    <button 
                        className="btn btn-primary"
                        onClick={() => navigate('/seller/CreateProduct')}
                    >
                        Add New Product
                    </button>
                </div>
            </div>
            <div className="row">
                <div className="col-md-8">
                    <h3>Your Products</h3>
                    <div className="row">
                        {products.map(product => (
                            <div key={product.id} className="col-md-6 mb-4">
                                <div className="card">
                                    <img 
                                        src={product.imageFilename} 
                                        className="card-img-top" 
                                        alt={product.name} 
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{product.name}</h5>
                                        <p className="card-text">₹{product.price}</p>
                                        <button 
                                            className="btn btn-secondary me-2"
                                            onClick={() => navigate(`/seller/EditProduct/${product.id}`)}
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-md-4">
                    <h3>Recent Orders</h3>
                    {orders.map(order => (
                        <div key={order.id} className="card mb-3">
                            <div className="card-body">
                                <h6>Order #{order.id}</h6>
                                <p className="mb-1">Amount: ₹{order.amount}</p>
                                <p className="mb-1">Status: {order.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}