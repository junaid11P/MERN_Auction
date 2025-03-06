import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function Payment() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orderDetails, setOrderDetails] = useState(null);
    const [utrNumber, setUtrNumber] = useState('');
    const [paymentProof, setPaymentProof] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user?._id) {
                    navigate('/login');
                    return;
                }

                const response = await fetch(`http://localhost:3001/api/orders/${orderId}`);
                if (!response.ok) throw new Error('Failed to fetch order details');
                
                const data = await response.json();
                setOrderDetails(data.order);
            } catch (error) {
                console.error('Error:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId, navigate]);

    const handlePaymentSubmission = async (e) => {
        e.preventDefault();
        
        try {
            if (!utrNumber.trim()) {
                alert('Please enter UTR number');
                return;
            }

            if (!paymentProof) {
                alert('Please upload payment proof');
                return;
            }

            const formData = new FormData();
            formData.append('utrNumber', utrNumber);
            formData.append('paymentProof', paymentProof);
            
            // Get user details from localStorage
            const user = JSON.parse(localStorage.getItem('user'));

            // Add payment details to formData
            formData.append('userId', user._id);
            formData.append('orderId', orderId);
            formData.append('amount', orderDetails.totalAmount);
            formData.append('paymentDate', new Date().toISOString());

            const response = await fetch(`http://localhost:3001/api/payments`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to submit payment proof');
            }

            // Clear cart after successful payment submission
            await fetch(`http://localhost:3001/api/cart/${user._id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            alert('Payment proof submitted successfully! Please wait for seller verification.');
            navigate('/buyer/orders');

        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Failed to submit payment proof');
        }
    };

    if (loading) return <div className="container my-4">Loading...</div>;
    if (error) return <div className="container my-4 alert alert-danger">{error}</div>;
    if (!orderDetails) return <div className="container my-4">Order not found</div>;

    return (
        <div className="container my-4">
            <h2 className="mb-4">Payment Details</h2>
            <div className="row">
                <div className="col-md-8">
                    <div className="card mb-4">
                        <div className="card-header">
                            <h5 className="mb-0">Order Summary</h5>
                        </div>
                        <div className="card-body">
                            <p><strong>Order ID:</strong> {orderId}</p>
                            <p><strong>Total Amount:</strong> ₹{orderDetails.totalAmount}</p>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">Payment Instructions</h5>
                        </div>
                        <div className="card-body">
                            <div className="text-center mb-4">
                                <img
                                    src="http://localhost:3001/qrcodes/payment_QR.jpeg"
                                    alt="Payment QR Code"
                                    style={{ maxWidth: '250px' }}
                                    className="img-fluid mb-3"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/placeholder-qr.png';
                                        console.error('Failed to load QR code image');
                                    }}
                                />
                                <div className="alert alert-info">
                                    <strong>UPI ID:</strong> 8105238129-3@ybl
                                </div>
                            </div>

                            <div className="alert alert-warning">
                                <h6 className="alert-heading">Payment Steps:</h6>
                                <ol className="mb-0">
                                    <li>Scan the QR code above or use the UPI ID</li>
                                    <li>Make payment of exact amount: ₹{orderDetails.totalAmount}</li>
                                    <li>Take screenshot of successful payment</li>
                                    <li>Note down the UTR number from your payment app</li>
                                    <li>Submit both UTR number and payment screenshot below</li>
                                </ol>
                            </div>

                            <form onSubmit={handlePaymentSubmission}>
                                <div className="mb-3">
                                    <label className="form-label">UTR Number</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={utrNumber}
                                        onChange={(e) => setUtrNumber(e.target.value)}
                                        required
                                        placeholder="Enter UTR Number"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Payment Screenshot</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        onChange={(e) => setPaymentProof(e.target.files[0])}
                                        required
                                        accept="image/*"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={!utrNumber || !paymentProof}
                                >
                                    Submit Payment Proof
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}