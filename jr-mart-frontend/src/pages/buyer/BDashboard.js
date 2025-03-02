import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BDashboard() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user?._id || user.userType !== 'buyer') {
                    navigate('/login');
                    return;
                }

                // Fetch products and cart in parallel
                const [productsRes, cartRes] = await Promise.all([
                    fetch('http://localhost:3001/api/products'),
                    fetch(`http://localhost:3001/api/cart/${user._id}`)
                ]);

                if (!productsRes.ok) throw new Error('Failed to fetch products');
                if (!cartRes.ok) throw new Error('Failed to fetch cart');

                const productsData = await productsRes.json();
                const cartData = await cartRes.json();

                setProducts(productsData.products || []);
                setCartCount(cartData.cart?.products?.length || 0);
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
        </div>
    );
}