import { useState, useEffect } from 'react';

export default function BDashboard() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        // Fetch products from db.json
        fetch('http://localhost:3001/products')
            .then(res => res.json())
            .then(data => setProducts(data));
    }, []);

    const addToCart = (product) => {
        setCart([...cart, product]);
    };

    return (
        <div className="container my-4">
            <h2>Welcome to Buyer Dashboard</h2>
            <div className="row">
                {products.map(product => (
                    <div key={product.id} className="col-md-4 mb-4">
                        <div className="card">
                            <img 
                                src={product.imageFilename} 
                                className="card-img-top" 
                                alt={product.name} 
                            />
                            <div className="card-body">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text">{product.description}</p>
                                <p className="card-text">₹{product.price}</p>
                                <button 
                                    className="btn btn-primary"
                                    onClick={() => addToCart(product)}
                                >
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