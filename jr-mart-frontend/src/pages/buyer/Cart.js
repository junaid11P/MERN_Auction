import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user?._id || user.userType !== 'buyer') {
                    navigate('/login');
                    return;
                }

                const [cartResponse, productsResponse] = await Promise.all([
                    fetch(`http://localhost:3001/api/cart/${user._id}`, {
                        headers: { 'Content-Type': 'application/json' }
                    }),
                    fetch('http://localhost:3001/api/products', {
                        headers: { 'Content-Type': 'application/json' }
                    })
                ]);

                if (!cartResponse.ok || !productsResponse.ok) {
                    throw new Error('Failed to fetch data');
                }

                const [cartData, productsData] = await Promise.all([
                    cartResponse.json(),
                    productsResponse.json()
                ]);

                const productsMap = productsData.products.reduce((acc, product) => {
                    acc[product._id] = product;
                    return acc;
                }, {});

                setCartItems(cartData.cart?.products || []);
                setProducts(productsMap);
            } catch (error) {
                console.error('Error:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const removeFromCart = async (productId) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await fetch(`http://localhost:3001/api/cart/${user._id}/product/${productId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setCartItems(cartItems.filter(item => item.productId !== productId));
            } else {
                throw new Error('Failed to remove item');
            }
        } catch (error) {
            console.error('Error removing item:', error);
            setError(error.message);
        }
    };

    const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await fetch(`http://localhost:3001/api/cart/${user._id}/product/${productId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity: newQuantity })
            });

            if (response.ok) {
                setCartItems(cartItems.map(item => 
                    item.productId === productId 
                        ? {...item, quantity: newQuantity}
                        : item
                ));
            } else {
                throw new Error('Failed to update quantity');
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            setError(error.message);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const product = products[item.productId];
            return total + (product?.price || 0) * item.quantity;
        }, 0);
    };

    if (loading) return <div className="container my-4">Loading...</div>;
    if (error) return <div className="container my-4 alert alert-danger">{error}</div>;

    return (
        <div className="container my-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Shopping Cart</h2>
                <button 
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/')}
                >
                    Continue Shopping
                </button>
            </div>

            {cartItems.length === 0 ? (
                <div className="text-center my-5">
                    <h4>Your cart is empty</h4>
                    <button 
                        className="btn btn-primary mt-3"
                        onClick={() => navigate('/')}
                    >
                        Start Shopping
                    </button>
                </div>
            ) : (
                <>
                    {cartItems.map(item => {
                        const product = products[item.productId];
                        if (!product) return null;

                        return (
                            <div key={item.productId} className="card mb-3">
                                <div className="row g-0">
                                    <div className="col-md-2">
                                        <img 
                                            src={`http://localhost:3001${product.image}`}
                                            className="img-fluid rounded-start" 
                                            alt={product.name} 
                                            style={{ height: '150px', objectFit: 'cover' }}
                                            onError={(e) => {
                                                e.target.src = '/placeholder.jpg';
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-7">
                                        <div className="card-body">
                                            <h5 className="card-title">{product.name}</h5>
                                            <p className="card-text">₹{product.price}</p>
                                            <div className="d-flex align-items-center">
                                                <button 
                                                    className="btn btn-sm btn-outline-secondary"
                                                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                >
                                                    -
                                                </button>
                                                <span className="mx-3">{item.quantity}</span>
                                                <button 
                                                    className="btn btn-sm btn-outline-secondary"
                                                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3 d-flex align-items-center justify-content-center">
                                        <button 
                                            className="btn btn-danger"
                                            onClick={() => removeFromCart(item.productId)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    
                    <div className="card mt-4">
                        <div className="card-body">
                            <h5 className="card-title">Order Summary</h5>
                            <div className="d-flex justify-content-between mb-3">
                                <span>Total ({cartItems.length} items)</span>
                                <span>₹{calculateTotal()}</span>
                            </div>
                            <button 
                                className="btn btn-success w-100"
                                onClick={() => navigate('/buyer/checkout')}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}