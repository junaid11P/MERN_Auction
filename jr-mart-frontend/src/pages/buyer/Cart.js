import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch cart items
                const cartResponse = await fetch('http://localhost:3001/cart');
                const cartData = await cartResponse.json();

                // Fetch products
                const productsResponse = await fetch('http://localhost:3001/products');
                const productsData = await productsResponse.json();

                // Create products lookup object
                const productsMap = productsData.reduce((acc, product) => {
                    acc[product.id] = product;
                    return acc;
                }, {});

                setCartItems(cartData);
                setProducts(productsMap);
            } catch (error) {
                console.error('Error fetching cart data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const removeFromCart = async (cartItemId) => {
        try {
            await fetch(`http://localhost:3001/cart/${cartItemId}`, {
                method: 'DELETE'
            });
            setCartItems(cartItems.filter(item => item.id !== cartItemId));
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const updateQuantity = async (cartItem, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            const response = await fetch(`http://localhost:3001/cart/${cartItem.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity: newQuantity })
            });

            if (response.ok) {
                setCartItems(cartItems.map(item => 
                    item.id === cartItem.id 
                        ? {...item, quantity: newQuantity}
                        : item
                ));
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const product = products[item.productId];
            return total + (product?.price || 0) * item.quantity;
        }, 0);
    };

    if (loading) {
        return <div className="container my-4">Loading...</div>;
    }

    return (
        <div className="container my-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Shopping Cart</h2>
                <button 
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/buyer/dashboard')}
                >
                    Continue Shopping
                </button>
            </div>

            {cartItems.length === 0 ? (
                <div className="text-center my-5">
                    <h4>Your cart is empty</h4>
                    <button 
                        className="btn btn-primary mt-3"
                        onClick={() => navigate('/buyer/dashboard')}
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
                            <div key={item.id} className="card mb-3">
                                <div className="row g-0">
                                    <div className="col-md-2">
                                        <img 
                                            src={product.imageFilename} 
                                            className="img-fluid rounded-start" 
                                            alt={product.name} 
                                            style={{ maxHeight: '150px', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div className="col-md-7">
                                        <div className="card-body">
                                            <h5 className="card-title">{product.name}</h5>
                                            <p className="card-text">₹{product.price}</p>
                                            <div className="d-flex align-items-center">
                                                <button 
                                                    className="btn btn-sm btn-outline-secondary"
                                                    onClick={() => updateQuantity(item, item.quantity - 1)}
                                                >
                                                    -
                                                </button>
                                                <span className="mx-3">{item.quantity}</span>
                                                <button 
                                                    className="btn btn-sm btn-outline-secondary"
                                                    onClick={() => updateQuantity(item, item.quantity + 1)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3 d-flex align-items-center justify-content-center">
                                        <button 
                                            className="btn btn-danger"
                                            onClick={() => removeFromCart(item.id)}
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
                                onClick={() => navigate('/checkout')}
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