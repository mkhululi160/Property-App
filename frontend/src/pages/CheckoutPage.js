import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useCreatePaymentIntentMutation } from '../redux/api/apiSlice';
import CheckoutForm from '../components/Payment/CheckoutForm';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';
import { formatPrice } from '../utils/formatters';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState('');

  const { property, amount, paymentType } = location.state || {};

  const [createPaymentIntent, { isLoading, error }] = useCreatePaymentIntentMutation();

  useEffect(() => {
    if (!property) {
      navigate('/properties');
      return;
    }

    const getPaymentIntent = async () => {
      try {
        const result = await createPaymentIntent({
          amount: amount || property.price * 0.1,
          paymentType: paymentType || 'deposit',
          propertyId: property._id,
        }).unwrap();

        setClientSecret(result.clientSecret);
      } catch (err) {
        console.error('Payment intent creation failed:', err);
      }
    };

    getPaymentIntent();
  }, [property, amount, paymentType, createPaymentIntent, navigate]);

  if (!property) {
    return <Message type="error">No property information found</Message>;
  }

  if (isLoading) return <Loader />;
  if (error) return <Message type="error">{error?.data?.message || error.error}</Message>;

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#2563eb',
    },
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Complete Your Payment</h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          <div className="flex space-x-4 mb-4">
            <img
              src={property.images?.[0]?.url || 'https://via.placeholder.com/100'}
              alt={property.title}
              className="w-24 h-20 object-cover rounded"
            />
            <div>
              <h3 className="font-semibold">{property.title}</h3>
              <p className="text-gray-600 text-sm">
                {property.address?.city}, {property.address?.state}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span>Property Price:</span>
              <span className="font-semibold">{formatPrice(property.price)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Payment Type:</span>
              <span className="capitalize">{paymentType || 'Deposit'}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total Amount:</span>
              <span className="text-primary">
                {formatPrice(amount || property.price * 0.1)}
              </span>
            </div>
          </div>
        </div>

        {clientSecret && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm
                amount={amount || property.price * 0.1}
                onSuccess={() => navigate('/payment-success', {
                  state: { property, amount: amount || property.price * 0.1 }
                })}
              />
            </Elements>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;