import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch products from MongoDB
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/products');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProducts(data.products);
                setFilteredProducts(data.products);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError(error.message);
            }
        };

        fetchProducts();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        const filtered = products.filter(product => 
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    const handleAddToCart = async (product) => {
        setIsLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                navigate('/login');
                return;
            }

            if (user.userType === 'seller') {
                alert('Sellers cannot add items to cart');
                return;
            }

            const cartItem = {
                userId: user._id,
                productId: product._id,
                quantity: 1
            };

            const response = await fetch('http://localhost:3001/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cartItem)
            });

            const data = await response.json();

            if (response.ok) {
                alert('Added to cart!');
                navigate('/buyer/cart');
            } else {
                throw new Error(data.message || 'Failed to add item to cart');
            }
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Failed to add item to cart');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container-fluid py-5" style={{ backgroundColor: '#f0f0d5' }}>
            <div className="container">
                {/* Category Carousel */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div 
                            id="categoryCarousel" 
                            className="carousel slide carousel-fade" // Added carousel-fade for smooth transitions
                            data-bs-ride="carousel"
                            data-bs-interval="5000"
                            data-bs-touch="true"
                            data-bs-pause="hover"
                        >
                            <div className="carousel-indicators">
                                <button type="button" data-bs-target="#categoryCarousel" data-bs-slide-to="0" className="active" aria-current="true"></button>
                                <button type="button" data-bs-target="#categoryCarousel" data-bs-slide-to="1"></button>
                                <button type="button" data-bs-target="#categoryCarousel" data-bs-slide-to="2"></button>
                                <button type="button" data-bs-target="#categoryCarousel" data-bs-slide-to="3"></button>
                            </div>
                            <div className="carousel-inner rounded shadow">
                                <div className="carousel-item active">
                                    <div className="overlay" style={{ backgroundColor: 'rgba(0,0,0,0.4)', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></div>
                                    <img 
                                        src="/images/fashion-banner.jpg" 
                                        className="d-block w-100" 
                                        alt="Fashion"
                                        style={{ height: '400px', objectFit: 'cover' }}
                                    />
                                    <div className="carousel-caption d-none d-md-block p-4 rounded" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                        <h3 className="fw-bold">Fashion</h3>
                                        <button 
                                            className="btn btn-light btn-lg shadow-sm"
                                            onClick={() => {
                                                setSearchQuery('Fashion');
                                                handleSearch({ preventDefault: () => {} });
                                            }}
                                        >
                                            Explore Fashion
                                        </button>
                                    </div>
                                </div>
                                <div className="carousel-item">
                                    <div className="overlay" style={{ backgroundColor: 'rgba(0,0,0,0.4)', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></div>
                                    <img 
                                        src="/images/grocery-banner.jpg" 
                                        className="d-block w-100" 
                                        alt="Grocery"
                                        style={{ height: '400px', objectFit: 'cover' }}
                                    />
                                    <div className="carousel-caption d-none d-md-block p-4 rounded" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                        <h3 className="fw-bold">Grocery</h3>
                                        <button 
                                            className="btn btn-light btn-lg shadow-sm"
                                            onClick={() => {
                                                setSearchQuery('Grocery');
                                                handleSearch({ preventDefault: () => {} });
                                            }}
                                        >
                                            Explore Grocery
                                        </button>
                                    </div>
                                </div>
                                <div className="carousel-item">
                                    <div className="overlay" style={{ backgroundColor: 'rgba(0,0,0,0.4)', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></div>
                                    <img 
                                        src="/images/mobiles-banner.jpg" 
                                        className="d-block w-100" 
                                        alt="Mobiles"
                                        style={{ height: '400px', objectFit: 'cover' }}
                                    />
                                    <div className="carousel-caption d-none d-md-block p-4 rounded" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                        <h3 className="fw-bold">Mobiles</h3>
                                        <button 
                                            className="btn btn-light btn-lg shadow-sm"
                                            onClick={() => {
                                                setSearchQuery('Mobiles');
                                                handleSearch({ preventDefault: () => {} });
                                            }}
                                        >
                                            Explore Mobiles
                                        </button>
                                    </div>
                                </div>
                                <div className="carousel-item">
                                    <div className="overlay" style={{ backgroundColor: 'rgba(0,0,0,0.4)', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></div>
                                    <img 
                                        src="/images/laptop-banner.jpg" 
                                        className="d-block w-100" 
                                        alt="Laptops"
                                        style={{ height: '400px', objectFit: 'cover' }}
                                    />
                                    <div className="carousel-caption d-none d-md-block p-4 rounded" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                        <h3 className="fw-bold">Laptops</h3>
                                        <button 
                                            className="btn btn-light btn-lg shadow-sm"
                                            onClick={() => {
                                                setSearchQuery('Laptop');
                                                handleSearch({ preventDefault: () => {} });
                                            }}
                                        >
                                            Explore Laptops
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <button className="carousel-control-prev" type="button" data-bs-target="#categoryCarousel" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#categoryCarousel" data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Header Section */}
                <div className="row mb-4">
                    <div className="col-lg-8">
                        <div className="alert shadow-sm" style={{ backgroundColor: 'white' }}>
                            <div className="d-flex align-items-center">
                                <div className="flex-grow-1">
                                    <h2 className="heading">Everything in 10 MINUTES  🛒</h2>
                                    <p className="mb-0">Best prices, and superfast delivery!</p>
                                </div>
                                <div className="ms-3">
                                    <img 
                                        src="/Free delivery.jpg" 
                                        alt="Free Delivery" 
                                        style={{
                                            width: '220px',
                                            height: 'auto',
                                            objectFit: 'contain'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <form className="d-flex" onSubmit={handleSearch}>
                            <input 
                                className="form-control me-2" 
                                type="search" 
                                placeholder="Search products..." 
                                aria-label="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button className="btn btn-primary" type="submit">
                                <i className="bi bi-search"></i> Search
                            </button>
                        </form>
                    </div>
                </div>

                {/* Search Results */}
                {searchQuery && (
                    <div className="row mb-4">
                        <div className="col">
                            <h3>Search Results</h3>
                            <div className="row g-4">
                                {filteredProducts.map(product => (
                                    <div className="col-md-3" key={product._id}>
                                        <div className="card h-100 shadow-sm">
                                            <img 
                                                src={`http://localhost:3001${product.image}`}
                                                className="card-img-top"
                                                alt={product.name}
                                                style={{ height: '200px', objectFit: 'cover' }}
                                            />
                                            <div className="card-body d-flex flex-column">
                                                <h5 className="card-title">{product.name}</h5>
                                                <p className="card-text text-muted">{product.category}</p>
                                                <p className="card-text">₹{product.price}</p>
                                                <button 
                                                    className="btn btn-primary mt-auto"
                                                    onClick={() => handleAddToCart(product)}
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? (
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    ) : (
                                                        <i className="bi bi-cart-plus me-2"></i>
                                                    )}
                                                    {isLoading ? 'Adding...' : 'Add to Cart'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <div className="col">
                                        <p className="text-muted">No products found matching your search.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Featured Categories */}
                <div className="row g-4 mb-4">
                    {['Fashion', 'Grocery', 'Mobiles', 'Laptop'].map((category) => (
                        <div className="col-md-3" key={category}>
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">{category}</h5>
                                    <p className="card-text">Explore our {category} collection</p>
                                    <button 
                                        className="btn btn-outline-primary"
                                        onClick={() => {
                                            setSearchQuery(category);
                                            const filtered = products.filter(product => 
                                                product.category.toLowerCase() === category.toLowerCase()
                                            );
                                            setFilteredProducts(filtered);
                                        }}
                                    >
                                        Browse
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}