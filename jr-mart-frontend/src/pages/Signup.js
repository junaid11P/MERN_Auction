import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        email: '',
        userType: '',
        address: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Add API call to register user
            console.log('Registering user:', formData);
            navigate('/login');
        } catch (error) {
            console.error('Error registering user:', error);
        }
    };

    return (
        <div className="container my-4">
            <div className="row align-items-center">
                <div className="col-md-6">
                    <h2>Sign Up</h2>
                    <p className="text-muted">
                        Already have an account? <Link to="/login">Login here</Link>
                    </p>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Select User Type</label>
                            <div className="d-flex gap-3">
                                <div className="form-check">
                                    <input
                                        type="radio"
                                        className="form-check-input"
                                        id="buyer"
                                        name="userType"
                                        value="buyer"
                                        checked={formData.userType === 'buyer'}
                                        onChange={handleChange}
                                        required
                                    />
                                    <label className="form-check-label" htmlFor="buyer">
                                        Buyer
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        type="radio"
                                        className="form-check-input"
                                        id="seller"
                                        name="userType"
                                        value="seller"
                                        checked={formData.userType === 'seller'}
                                        onChange={handleChange}
                                        required
                                    />
                                    <label className="form-check-label" htmlFor="seller">
                                        Seller
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Full Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                            <input
                                type="tel"
                                className="form-control"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                pattern="[0-9]{10}"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                pattern="[0-9,A-Z,a-z]{10}"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">Address</label>
                            <textarea
                                className="form-control"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Sign Up</button>
                    </form>
                </div>
                <div className="col-md-6 text-end">
                    <img src="/Signup.jpg" alt="Signup" className="img-fluid" style={{ maxWidth: '100%' }} />
                </div>
            </div>
        </div>
    );
}