import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Initialize Stripe (use your publishable key)
const stripePromise = loadStripe('pk_test_YOUR_PUBLISHABLE_KEY');

// Stripe Checkout Form Component
function StripeCheckoutForm({ amount, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Get the CardElement
      const cardElement = elements.getElement(CardElement);

      // Create Payment Method (this tokenizes the card)
      const { error: methodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: document.getElementById('cardholder-name').value,
          email: document.getElementById('email').value,
        },
      });

      if (methodError) {
        setError(methodError.message);
        setProcessing(false);
        return;
      }

      // Send the payment method token to your backend
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id, // This is the token
          amount: amount, // amount in cents
          currency: 'usd',
        }),
      });

      const result = await response.json();

      if (result.error) {
        setError(result.error);
        setProcessing(false);
        return;
      }

      // Confirm the payment
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        result.clientSecret
      );

      if (confirmError) {
        setError(confirmError.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent);
      }

    } catch (err) {
      setError(err.message);
      onError(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-form">
      <div className="form-group">
        <label htmlFor="cardholder-name">Cardholder Name</label>
        <input
          id="cardholder-name"
          type="text"
          placeholder="John Doe"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="john@example.com"
          required
        />
      </div>

      <div className="form-group">
        <label>Card Details</label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
            hidePostalCode: false,
          }}
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="submit-button"
      >
        {processing ? 'Processing...' : `Pay $${(amount / 100).toFixed(2)}`}
      </button>
    </form>
  );
}

// Stripe Payment Wrapper Component
export function StripePayment({ amount, onSuccess, onError }) {
  return (
    <Elements stripe={stripePromise}>
      <StripeCheckoutForm
        amount={amount}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
}