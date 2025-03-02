import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        userType: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                alert('Registration successful!');
                navigate('/login');
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body p-4">
                            <h2 className="text-center mb-4">Create Account</h2>
                            {error && <div className="alert alert-danger">{error}</div>}
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">I want to:</label>
                                    <div className="d-flex gap-3 mb-3">
                                        <button
                                            type="button"
                                            className={`btn flex-grow-1 ${formData.userType === 'buyer' ? 'btn-primary' : 'btn-outline-primary'}`}
                                            onClick={() => setFormData(prev => ({ ...prev, userType: 'buyer' }))}
                                        >
                                            Buy Products
                                        </button>
                                        <button
                                            type="button"
                                            className={`btn flex-grow-1 ${formData.userType === 'seller' ? 'btn-primary' : 'btn-outline-primary'}`}
                                            onClick={() => setFormData(prev => ({ ...prev, userType: 'seller' }))}
                                        >
                                            Sell Products
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
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

                                <div className="mb-4">
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

                                <div className="d-grid">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary py-2"
                                        disabled={!formData.userType}
                                    >
                                        Create Account
                                    </button>
                                </div>
                            </form>

                            <div className="text-center mt-3">
                                <Link to="/login" className="text-decoration-none">
                                    Already have an account? Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}