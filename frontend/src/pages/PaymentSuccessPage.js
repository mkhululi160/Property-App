import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import { formatPrice, formatDate } from '../utils/formatters';

const PaymentSuccessPage = () => {
  const location = useLocation();
  const { property, amount, payment } = location.state || {};

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your payment. Your transaction has been completed successfully.
        </p>

        {property && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
            <div className="space-y-2">
              <p><strong>Property:</strong> {property.title}</p>
              <p><strong>Amount:</strong> {formatPrice(amount)}</p>
              <p><strong>Payment Type:</strong> {payment?.paymentType || 'Deposit'}</p>
              <p><strong>Date:</strong> {formatDate(new Date())}</p>
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
          </div>
        )}

        <div className="space-x-4">
          <Link to="/my-bookings" className="btn-primary">
            View My Bookings
          </Link>
          <Link to="/properties" className="btn-secondary">
            Browse More Properties
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;