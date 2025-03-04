import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SProfile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        email: '',
        address: '',
        upiId: '',
        qrCode: null
    });
    const [qrPreview, setQrPreview] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user?._id || user.userType !== 'seller') {
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
                    address: data.user.address,
                    upiId: data.user.upiId || '',
                    qrCode: null
                });
                setQrPreview(data.user.qrCode ? `http://localhost:3001${data.user.qrCode}` : null);
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
        const { name, value, files } = e.target;
        if (name === 'qrCode' && files[0]) {
            setFormData(prev => ({ ...prev, qrCode: files[0] }));
            setQrPreview(URL.createObjectURL(files[0]));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const formDataToSend = new FormData();
            
            Object.keys(formData).forEach(key => {
                if (key === 'qrCode' && formData[key]) {
                    formDataToSend.append('qrCode', formData[key]);
                } else if (key !== 'qrCode') {
                    formDataToSend.append(key, formData[key]);
                }
            });

            const response = await fetch(`http://localhost:3001/api/users/${user._id}`, {
                method: 'PATCH',
                body: formDataToSend
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            const updatedData = await response.json();
            setProfile(updatedData.user);
            setIsEditing(false);
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
                            <h4 className="mb-0">Seller Profile</h4>
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
                                    <div className="mb-3">
                                        <label className="form-label">UPI ID</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="upiId"
                                            value={formData.upiId}
                                            onChange={handleChange}
                                            placeholder="username@bankname"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">QR Code</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            name="qrCode"
                                            accept="image/*"
                                            onChange={handleChange}
                                        />
                                        {qrPreview && (
                                            <img
                                                src={qrPreview}
                                                alt="QR Code Preview"
                                                className="mt-2"
                                                style={{ maxWidth: '200px' }}
                                            />
                                        )}
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
                                                setFormData({
                                                    ...profile,
                                                    qrCode: null
                                                });
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
                                    <p><strong>UPI ID:</strong> {profile.upiId || 'Not set'}</p>
                                    {profile.qrCode && (
                                        <div>
                                            <p><strong>QR Code:</strong></p>
                                            <img
                                                src={`http://localhost:3001${profile.qrCode}`}
                                                alt="Payment QR Code"
                                                style={{ maxWidth: '200px' }}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}