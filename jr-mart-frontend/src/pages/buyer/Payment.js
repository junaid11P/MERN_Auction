import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function Payment() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orderDetails, setOrderDetails] = useState(null);
    const [sellerPaymentDetails, setSellerPaymentDetails] = useState({});

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

                // Fetch payment details for each seller
                const sellerIds = [...new Set(data.order.products.map(p => p.sellerId))];
                const sellerDetails = {};

                await Promise.all(sellerIds.map(async (sellerId) => {
                    const sellerResponse = await fetch(`http://localhost:3001/api/users/${sellerId}/payment-details`);
                    if (sellerResponse.ok) {
                        const sellerData = await sellerResponse.json();
                        sellerDetails[sellerId] = {
                            upiId: sellerData.paymentDetails.upiId,
                            qrCode: sellerData.paymentDetails.qrCode
                        };
                    }
                }));

                setSellerPaymentDetails(sellerDetails);
            } catch (error) {
                console.error('Error:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId, navigate]);

    const handlePaymentComplete = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/orders/${orderId}/payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentStatus: 'completed' })
            });

            if (!response.ok) throw new Error('Failed to update payment status');

            alert('Payment marked as completed!');
            navigate('/buyer/orders');
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
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
                            <p><strong>Payment Method:</strong> {orderDetails.paymentMethod.toUpperCase()}</p>
                        </div>
                    </div>

                    {orderDetails.paymentMethod === 'online' && (
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">Seller Payment Details</h5>
                            </div>
                            <div className="card-body">
                                {orderDetails.products.map((product, index) => {
                                    const sellerDetails = sellerPaymentDetails[product.sellerId];
                                    
                                    return (
                                        <div key={index} className="mb-4">
                                            <h6>Seller {index + 1}</h6>
                                            <p><strong>Amount:</strong> ₹{product.price * product.quantity}</p>
                                            {sellerDetails ? (
                                                <>
                                                    {sellerDetails.upiId && (
                                                        <p><strong>UPI ID:</strong> {sellerDetails.upiId}</p>
                                                    )}
                                                    {sellerDetails.qrCode && (
                                                        <div className="mb-3">
                                                            <p><strong>QR Code:</strong></p>
                                                            <img
                                                                src={`http://localhost:3001${sellerDetails.qrCode}`}
                                                                alt="Payment QR Code"
                                                                style={{ maxWidth: '200px' }}
                                                                className="mb-3"
                                                            />
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <p>No payment details available for this seller.</p>
                                            )}
                                            <hr />
                                        </div>
                                    );
                                })}
                                <button
                                    className="btn btn-success w-100"
                                    onClick={handlePaymentComplete}
                                >
                                    I have completed the payment
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}