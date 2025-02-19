import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    const [activeTab, setActiveTab] = useState('login');
    const pageStyle = {
        backgroundColor: '#FDF5E6',
        minHeight: '100vh',
        paddingTop: '2rem'
    };

    const brownStyle = {
        backgroundColor: '#8B4513', // Saddle Brown
        color: 'white'
    };

    const activeTabStyle = {
        backgroundColor: '#A0522D', // Sienna Brown
        color: 'white'
    };

    return (
        <div style={pageStyle}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card shadow">
                            <div className="card-header" style={brownStyle}>
                                <ul className="nav nav-tabs card-header-tabs">
                                    <li className="nav-item">
                                        <button 
                                            className={`nav-link ${activeTab === 'login' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('login')}
                                            style={activeTab === 'login' ? activeTabStyle : { color: 'white' }}
                                        >
                                            Login
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button 
                                            className={`nav-link ${activeTab === 'signup' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('signup')}
                                            style={activeTab === 'signup' ? activeTabStyle : { color: 'white' }}
                                        >
                                            Sign Up
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            <div className="card-body">
                                {activeTab === 'login' ? (
                                    <form>
                                        <h3 className="mb-4">Login</h3>
                                        <div className="mb-3">
                                            <label className="form-label">User Type</label>
                                            <select className="form-select">
                                                <option value="">Select User Type</option>
                                                <option value="buyer">Buyer</option>
                                                <option value="seller">Seller</option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Email address</label>
                                            <input type="email" className="form-control" required />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Password</label>
                                            <input type="password" className="form-control" required />
                                        </div>
                                        <button type="submit" className="btn btn-primary w-100">Login</button>
                                    </form>
                                ) : (
                                    <form>
                                        <h3 className="mb-4">Sign Up</h3>
                                        <div className="mb-3">
                                            <label className="form-label">User Type</label>
                                            <select className="form-select" required>
                                                <option value="">Select User Type</option>
                                                <option value="buyer">Buyer</option>
                                                <option value="seller">Seller</option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Full Name</label>
                                            <input type="text" className="form-control" required />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Email address</label>
                                            <input type="email" className="form-control" required />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Password</label>
                                            <input type="password" className="form-control" required />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Confirm Password</label>
                                            <input type="password" className="form-control" required />
                                        </div>
                                        <button type="submit" className="btn btn-primary w-100">Sign Up</button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}