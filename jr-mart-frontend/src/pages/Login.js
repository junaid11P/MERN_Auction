import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        userType: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Fetch users from db.json
            const response = await fetch('http://localhost:3001/users');
            const users = await response.json();
            
            const user = users.find(u => 
                u.email === formData.email && 
                u.userType === formData.userType
            );

            if (user) {
                // In production, use proper password validation
                if (formData.userType === 'buyer') {
                    navigate('/buyer/dashboard');
                } else {
                    navigate('/seller/dashboard');
                }
            } else {
                setError('Invalid credentials');
            }
        } catch (error) {
            setError('Login failed. Please try again.');
        }
    };

    return (
        <div className="container my-4">
            <div className="row align-items-center">
                <div className="col-md-6">
                    <h2>Login</h2>
                    <p className="text-muted">
                        New user? <Link to="/signup">Sign up here</Link>
                    </p>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Select User Type</label>
                            <div className="d-flex gap-3">
                                <div className="form-check">
                                    <input
                                        type="radio"
                                        className="form-check-input"
                                        name="userType"
                                        value="buyer"
                                        checked={formData.userType === 'buyer'}
                                        onChange={handleChange}
                                        required
                                    />
                                    <label className="form-check-label">Buyer</label>
                                </div>
                                <div className="form-check">
                                    <input
                                        type="radio"
                                        className="form-check-input"
                                        name="userType"
                                        value="seller"
                                        checked={formData.userType === 'seller'}
                                        onChange={handleChange}
                                        required
                                    />
                                    <label className="form-check-label">Seller</label>
                                </div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Login</button>
                    </form>
                </div>
                <div className="col-md-6 text-end">
                    <img src="/Login.jpg" alt="Login" className="img-fluid" />
                </div>
            </div>
        </div>
    );
}