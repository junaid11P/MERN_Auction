import React from 'react';

export default function PaymentInstructions({ onClose }) {
    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Payment Instructions</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="text-center mb-3">
                            <img 
                                src="/qrcodes/payment_QR.jpeg" 
                                alt="Payment QR Code"
                                style={{ maxWidth: '250px' }}
                                className="img-fluid"
                            />
                        </div>
                        <div className="alert alert-info">
                            <strong>UPI ID:</strong> 8105238129-3@ybl
                        </div>
                        <ol className="list-group list-group-numbered mb-3">
                            <li className="list-group-item">Scan the QR code or use the UPI ID</li>
                            <li className="list-group-item">Make the payment for the exact amount</li>
                            <li className="list-group-item">Take a screenshot of the successful payment</li>
                            <li className="list-group-item">Note down the UTR number from your payment app</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
}