import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const PaymentSuccess = ({ payment, property }) => {
  return (
    <div className="text-center py-12">
      <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
      <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
      <p className="text-gray-600 mb-6">
        Thank you for your payment. Your transaction has been completed.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6 max-w-md mx-auto">
        <h3 className="font-semibold mb-2">Payment Details</h3>
        <p><strong>Amount:</strong> ${payment?.amount?.toLocaleString()}</p>
        <p><strong>Property:</strong> {property?.title}</p>
        <p><strong>Payment ID:</strong> {payment?._id}</p>
        <p><strong>Date:</strong> {new Date(payment?.paidAt).toLocaleDateString()}</p>
        {payment?.receiptUrl && (
          <p>
            <a
              href={payment.receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Download Receipt
            </a>
          </p>
        )}
      </div>

      <div className="space-x-4">
        <Link to="/my-bookings" className="btn-primary">
          View My Bookings
        </Link>
        <Link to="/properties" className="btn-secondary">
          Browse More Properties
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;