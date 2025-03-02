import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function ProductList() {
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const fetchProducts = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user?._id) {
                throw new Error('User not authenticated');
            }

            const response = await fetch(`http://localhost:3001/api/products/seller/${user._id}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const data = await response.json();
            setProducts(data.products || []);
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Show success message if navigated from create product
        if (location.state?.success) {
            setSuccessMessage(location.state.message);
            // Clear the message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);
        }
        fetchProducts();
    }, [location]);

    const handleDelete = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/api/products/${productId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setProducts(products.filter(p => p._id !== productId));
                alert('Product deleted successfully');
            } else {
                throw new Error('Failed to delete product');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to delete product');
        }
    };

    if (loading) return <div className="container my-4">Loading...</div>;
    if (error) return <div className="container my-4 alert alert-danger">{error}</div>;

    return (
        <div className="container my-4">
            {successMessage && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    {successMessage}
                    <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => setSuccessMessage('')}
                    ></button>
                </div>
            )}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Your Products</h2>
                <div>
                    <Link to="/seller/CreateProduct" className="btn btn-primary me-2">
                        Add New Product
                    </Link>
                    <button 
                        className="btn btn-outline-primary"
                        onClick={() => {
                            setLoading(true);
                            fetchProducts();
                        }}
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {products.length === 0 ? (
                <div className="alert alert-info">
                    No products found. Start by adding a new product!
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td>
                                        <img
                                            src={`http://localhost:3001${product.image}`}
                                            alt={product.name}
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                objectFit: 'cover'
                                            }}
                                            onError={(e) => {
                                                e.target.src = '/placeholder.jpg';
                                            }}
                                        />
                                    </td>
                                    <td>{product.name}</td>
                                    <td>{product.category}</td>
                                    <td>₹{product.price}</td>
                                    <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <Link 
                                            to={`/seller/EditProduct/${product._id}`}
                                            className="btn btn-sm btn-outline-primary me-2"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDelete(product._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}