import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BDashboard() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]); // Initialize as empty array

    useEffect(() => {
        // Fetch products
        fetch('http://localhost:3001/products')
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(error => console.error('Error fetching products:', error));

        // Fetch cart items
        fetch('http://localhost:3001/cart')
            .then(res => res.json())
            .then(data => Array.isArray(data) ? setCart(data) : setCart([]))
            .catch(error => console.error('Error fetching cart:', error));
    }, []);

    // Calculate cart total with safety check
    const getCartItemsCount = () => {
        if (!Array.isArray(cart)) return 0;
        return cart.reduce((total, item) => total + (item.quantity || 1), 0);
    };

    const addToCart = async (product) => {
        try {
            // Check if product already exists in cart
            const existingCartItem = cart.find(item => item.productId === product.id);

            if (existingCartItem) {
                // Update quantity if product already in cart
                const response = await fetch(`http://localhost:3001/cart/${existingCartItem.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        quantity: existingCartItem.quantity + 1
                    })
                });

                if (response.ok) {
                    setCart(cart.map(item => 
                        item.id === existingCartItem.id 
                            ? {...item, quantity: item.quantity + 1}
                            : item
                    ));
                }
            } else {
                // Add new item to cart
                const cartItem = {
                    productId: product.id,
                    quantity: 1,
                    price: product.price,
                    addedAt: new Date().toISOString()
                };

                const response = await fetch('http://localhost:3001/cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(cartItem)
                });

                if (response.ok) {
                    const newCartItem = await response.json();
                    setCart([...cart, newCartItem]);
                }
            }
            alert('Added to cart!');
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add item to cart');
        }
    };

    return (
        <div className="container my-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Welcome to Buyer Dashboard</h2>
                <button 
                    className="btn btn-outline-primary d-flex align-items-center"
                    onClick={() => navigate('/buyer/Cart')}
                >
                    <img src="/cart4.svg" alt="cart" width="24" className="me-2" />
                    Cart ({getCartItemsCount()})
                </button>
            </div>
            <div className="row">
                {products.map(product => (
                    <div key={product.id} className="col-md-4 mb-4">
                        <div className="card h-100">
                            <img 
                                src={product.imageFilename} 
                                className="card-img-top"
                                alt={product.name}
                                style={{ height: '200px', objectFit: 'cover' }}
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
            </div>
        </div>
    );
}