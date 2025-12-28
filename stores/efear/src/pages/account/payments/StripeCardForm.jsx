import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Stripe Card Form Component
export const StripeCardForm = ({ onSuccess, onCancel, currentUser, makeDefault }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [cardholderName, setCardholderName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!cardholderName.trim()) {
      setError('Cardholder name is required');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);

      // Create Payment Method (tokenizes the card)
      const { error: methodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: cardholderName,
          email: currentUser?.email,
        },
      });

      if (methodError) {
        setError(methodError.message);
        setProcessing(false);
        return;
      }

      // Send tokenized payment method to backend
      const response = await fetch('/api/payments/add-payment-method', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          userId: currentUser._id,
          paymentMethodId: paymentMethod.id, // This is the secure token
          cardholderName: cardholderName,
          makeDefault: makeDefault,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to add payment method');
      }

      // Success callback
      onSuccess(result);

    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Cardholder Name</label>
        <input 
          type="text" 
          className="form-control"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          placeholder="John Doe"
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Card Details</label>
        <div className="form-control" style={{ padding: '12px' }}>
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
        <small className="text-muted">
          Your card details are securely processed by Stripe. We never see your full card number.
        </small>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="modal-footer">
        <button 
          type="button" 
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={processing}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={!stripe || processing}
        >
          {processing ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Adding...
            </>
          ) : (
            'Add Payment Method'
          )}
        </button>
      </div>
    </form>
  );
}

export default StripeCardForm;
