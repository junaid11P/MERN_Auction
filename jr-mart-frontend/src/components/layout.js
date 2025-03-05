import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userFromStorage = localStorage.getItem('user');
        if (userFromStorage) {
            const userData = JSON.parse(userFromStorage);
            setUser(userData);

            if (userData?.userType === 'buyer') {
                fetchRecentOrders(userData._id);
            }

            // Fetch recent orders for both buyer and seller
            if (userData?.userType === 'seller') {
                fetchSellerOrders(userData._id);
            }
        }
    }, [recentOrders.length]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        setRecentOrders([]); // Clear orders on logout
        navigate('/login');
    };

    const fetchRecentOrders = async (userId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/orders/user/${userId}/recent`);
            if (response.ok) {
                const data = await response.json();
                setRecentOrders(data.orders);
            }
        } catch (error) {
            console.error('Error fetching recent orders:', error);
        }
    };

    // Add this new function to fetch seller orders
    const fetchSellerOrders = async (sellerId) => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:3001/api/orders/seller/${sellerId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch seller orders');
            }
            const data = await response.json();
            if (data.success && Array.isArray(data.orders)) {
                setRecentOrders(data.orders);
            }
        } catch (error) {
            console.error('Error fetching seller orders:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg bg-white border-bottom box-shadow">
            <div className="container">
                <Link className="navbar-brand" to={user?.userType === 'seller' ? '/seller/dashboard' : '/'}>
                    <img src="/1.png" alt="..." width="45" className="me-2" />JR mart
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {(!user || user.userType === 'buyer') && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link text-dark" to="/">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-dark" to="/contact">Contact</Link>
                                </li>
                            </>
                        )}
                        {user?.userType === 'seller' && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link text-dark" to="/seller/ProductList">Products</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-dark" to="/seller/CreateProduct">Add Product</Link>
                                </li>
                            </>
                        )}
                    </ul>

                    <ul className="navbar-nav">
                        {user ? (
                            <>
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle text-dark" href="#" role="button" data-bs-toggle="dropdown">
                                        <img src="/person-circle.svg" alt="..." width="20" className="me-2" />
                                        {user.name}
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                        <li>
                                            <Link 
                                                className="dropdown-item" 
                                                to={`/${user.userType}/profile`}
                                            >
                                                Profile
                                            </Link>
                                        </li>
                                        <li>
                                            <Link 
                                                className="dropdown-item" 
                                                to={`/${user.userType}/dashboard`}
                                            >
                                                Dashboard
                                            </Link>
                                        </li>
                                        {user.userType === 'buyer' && (
                                            <li>
                                                <Link 
                                                    className="dropdown-item" 
                                                    to="/buyer/orders"
                                                >
                                                    My Orders
                                                </Link>
                                            </li>
                                        )}
                                        {user.userType === 'seller' && (
                                            <>
                                                <li>
                                                    <Link 
                                                        className="dropdown-item" 
                                                        to="/seller/recent-orders"
                                                    >
                                                        Recent Orders
                                                    </Link>
                                                </li>
                                            </>
                                        )}
                                        
                                        <li><hr className="dropdown-divider" /></li>
                                        <li>
                                            <button 
                                                className="dropdown-item text-danger" 
                                                onClick={handleLogout}
                                            >
                                                Logout
                                            </button>
                                        </li>
                                    </ul>
                                </li>
                                {user.userType === 'buyer' && (
                                    <li className="nav-item">
                                        <Link className="nav-link text-dark" to="/buyer/cart">
                                            <img src="/cart4.svg" alt="cart" width="20" className="me-2" />
                                        </Link>
                                    </li>
                                )}
                            </>
                        ) : (
                            <li className="nav-item">
                                <Link className="nav-link text-dark" to="/login">
                                    <img src="/person-circle.svg" alt="..." width="20" className="me-2" />
                                    Login
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export function Footer() {
    return(
        <div className="text-center p-4 bg-light border-top">
            <img src="/1.png" alt="..." width="30" className="me-2" />
            © 2025 JR mart. All rights reserved.

        </div>
    )
}