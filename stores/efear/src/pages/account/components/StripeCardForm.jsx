import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import {
  addPayments,
  createPayments,
  selectPaymentsLoading,
  selectPaymentsError,
  selectPaymentsSuccess,
  clearPaymentsState,
} from '../../../features/payments/slice';

// Stripe Card Form Component
export const StripeCardForm = ({ onSuccess, onCancel, currentUser, makeDefault = false }) => {
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  
  // Redux selectors
  const loading = useSelector(selectPaymentsLoading);
  const error = useSelector(selectPaymentsError);
  const success = useSelector(selectPaymentsSuccess);
  
  // Local state
  const [cardholderName, setCardholderName] = useState('');
  const [localError, setLocalError] = useState('');

  // Handle success from Redux
  useEffect(() => {
    if (success && !loading) {
      onSuccess(success);
      // Clear state after success
      dispatch(clearPaymentsState());
    }
  }, [success, loading, onSuccess, dispatch]);

  // Handle errors from Redux
  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!stripe || !elements) {
      setLocalError('Stripe has not loaded yet. Please try again.');
      return;
    }

    if (!cardholderName.trim()) {
      setLocalError('Please enter cardholder name');
      return;
    }

    if (!currentUser?._id) {
      setLocalError('User information is missing');
      return;
    }

    // Clear previous errors
    setLocalError('');

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
        setLocalError(methodError.message);
        return;
      }

      // Dispatch Redux action to save payment method
      dispatch(addPayments({
        userId: currentUser._id,
        paymentMethodId: paymentMethod.id, // Secure token from Stripe
        cardholderName: cardholderName,
        makeDefault: makeDefault,
        // Include card details for display purposes
        cardDetails: {
          last4: paymentMethod.card.last4,
          brand: paymentMethod.card.brand,
          expiryMonth: paymentMethod.card.exp_month.toString().padStart(2, '0'),
          expiryYear: paymentMethod.card.exp_year.toString(),
          fingerprint: paymentMethod.card.fingerprint,
        },
      }));

    } catch (err) {
      setLocalError('An unexpected error occurred. Please try again.');
      console.error('Payment method creation error:', err);
    }
  };

  const handleCancel = () => {
    // Clear any errors when canceling
    dispatch(clearPaymentsState());
    setLocalError('');
    onCancel();
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
          disabled={loading}
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
              disabled: loading,
            }}
          />
        </div>
        <small className="text-muted">
          Your card details are securely processed by Stripe. We never see your full card number.
        </small>
      </div>

      {/* Display errors */}
      {(localError || error) && (
        <div className="alert alert-danger" role="alert">
          {localError || error}
        </div>
      )}

      {/* Display success message temporarily */}
      {success && !loading && (
        <div className="alert alert-success" role="alert">
          Payment method added successfully!
        </div>
      )}

      <div className="modal-footer">
        <button 
          type="button" 
          className="btn btn-secondary"
          onClick={handleCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={!stripe || loading || !cardholderName.trim()}
        >
          {loading ? (
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
};
// Stripe Payment Wrapper Component (for checkout flow)
export function StripePayment({ amount, onSuccess, onError, currentUser }) {
  return (
    <StripeCardForm
      amount={amount}
      onSuccess={onSuccess}
      onError={onError}
      currentUser={currentUser}
      makeDefault={false}
    />
  );
}

export default StripeCardForm;