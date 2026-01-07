import React, { useState } from 'react';
import { useStripe, useElements, CardElement, PaymentElement } from '@stripe/react-stripe-js';

// Card element styling
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
  hidePostalCode: false,
};

const StripePayment = ({ clientSecret, amount, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [cardholderName, setCardholderName] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }

    if (!cardholderName.trim()) {
      setErrorMessage('Please enter the cardholder name');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const cardElement = elements.getElement(CardElement);

      // Confirm the payment with the card details
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: cardholderName,
          },
        },
      });

      if (error) {
        console.error('Payment error:', error);
        setErrorMessage(error.message || 'Payment failed. Please try again.');
        if (onError) {
          onError(error);
        }
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', paymentIntent);
        if (onSuccess) {
          onSuccess({ paymentIntent });
        }
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
      if (onError) {
        onError(error);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Cardholder Name *</label>
        <input
          type="text"
          className="form-control rounded-0"
          placeholder="John Doe"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          disabled={isProcessing}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Card Details *</label>
        <div className="form-control rounded-0" style={{ padding: '12px' }}>
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
        <small className="text-muted">
          <i className="bx bx-lock-alt me-1"></i>
          Your payment information is encrypted and secure
        </small>
      </div>

      {errorMessage && (
        <div className="alert alert-danger rounded-0" role="alert">
          <i className="bx bx-error-circle me-2"></i>
          {errorMessage}
        </div>
      )}

      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <span>Amount to be charged:</span>
          <strong className="text-primary h5 mb-0">${amount.toFixed(2)}</strong>
        </div>
      </div>

      <div className="d-grid">
        <button
          type="submit"
          className="btn btn-white btn-ecomm rounded-0"
          disabled={!stripe || isProcessing}
        >
          {isProcessing ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Processing Payment...
            </>
          ) : (
            <>
              <i className="bx bx-lock-alt me-2"></i>
              Pay ${amount.toFixed(2)}
            </>
          )}
        </button>
      </div>

      <div className="mt-3 text-center">
        <small className="text-muted">
          By confirming your payment, you agree to our terms and conditions
        </small>
      </div>

      {/* Test card info for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="alert alert-info mt-3 rounded-0">
          <small>
            <strong>Test Card:</strong> 4242 4242 4242 4242<br />
            <strong>Expiry:</strong> Any future date<br />
            <strong>CVC:</strong> Any 3 digits
          </small>
        </div>
      )}
    </form>
  );
};

export default StripePayment;