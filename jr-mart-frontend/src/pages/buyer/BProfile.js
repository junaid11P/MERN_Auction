import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BProfile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        email: '',
        address: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user?._id || user.userType !== 'buyer') {
                    navigate('/login');
                    return;
                }

                const response = await fetch(`http://localhost:3001/api/users/${user._id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch profile');
                }

                const data = await response.json();
                setProfile(data.user);
                setFormData({
                    name: data.user.name,
                    phoneNumber: data.user.phoneNumber,
                    email: data.user.email,
                    address: data.user.address || ''
                });
            } catch (error) {
                console.error('Error:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await fetch(`http://localhost:3001/api/users/${user._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            const data = await response.json();
            setProfile(data.user);
            setIsEditing(false);
            
            // Update local storage with new user data
            localStorage.setItem('user', JSON.stringify({
                ...user,
                ...data.user
            }));

            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Failed to update profile');
        }
    };

    if (loading) return <div className="container my-4">Loading...</div>;
    if (error) return <div className="container my-4 alert alert-danger">{error}</div>;
    if (!profile) return <div className="container my-4">No profile found</div>;

    return (
        <div className="container my-4">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h4 className="mb-0">Buyer Profile</h4>
                            {!isEditing && (
                                <button 
                                    className="btn btn-primary"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                        <div className="card-body">
                            {isEditing ? (
                                <form onSubmit={handleSubmit}>
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
                                        <label className="form-label">Phone Number</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
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
                                    <div className="mb-3">
                                        <label className="form-label">Address</label>
                                        <textarea
                                            className="form-control"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button type="submit" className="btn btn-success">
                                            Save Changes
                                        </button>
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setFormData(profile);
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div>
                                    <p><strong>Name:</strong> {profile.name}</p>
                                    <p><strong>Phone Number:</strong> {profile.phoneNumber}</p>
                                    <p><strong>Email:</strong> {profile.email}</p>
                                    <p><strong>Address:</strong> {profile.address}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}