'use client';

import { useState, type FormEvent } from 'react';
import { loadStripe, type PaymentIntent, type StripeError } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

/**
 * MERGE NOTE: original `StripePayment.jsx` used `useStripe`/`useElements` without
 * a visible `<Elements>` ancestor in this file, meaning it was wrapped somewhere
 * else in the tree (not among the uploaded files). Wrapping it here makes the
 * component self-contained, which matters more in Next.js since this now needs to
 * work as an isolated client component loaded lazily under `/checkout/payment`.
 *
 * Env var renamed: `REACT_APP_STRIPE_PUBLISHABLE_KEY` (CRA) →
 * `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (Next.js) — CRA's `REACT_APP_` prefix
 * convention does not apply here; Next.js requires `NEXT_PUBLIC_` for any env var
 * read in client-side code.
 */
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '');

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': { color: '#aab7c4' },
    },
    invalid: { color: '#fa755a', iconColor: '#fa755a' },
  },
  hidePostalCode: false,
};

interface StripePaymentFormProps {
  clientSecret: string;
  amount: number;
  onSuccess: (result: { paymentIntent: PaymentIntent }) => void;
  onError: (error: StripeError | Error) => void;
}

function InnerForm({ clientSecret, amount, onSuccess, onError }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [cardholderName, setCardholderName] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    if (!cardholderName.trim()) {
      setErrorMessage('Please enter the cardholder name');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error('Card element not mounted');

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: cardholderName },
        },
      });

      if (error) {
        setErrorMessage(error.message || 'Payment failed. Please try again.');
        onError(error);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess({ paymentIntent });
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred. Please try again.');
      onError(err instanceof Error ? err : new Error(String(err)));
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
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Card Details *</label>
        <div className="form-control rounded-0" style={{ padding: '12px' }}>
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
        <small className="text-muted">
          <i className="bx bx-lock-alt me-1" />
          Your payment information is encrypted and secure
        </small>
      </div>

      {errorMessage && (
        <div className="alert alert-danger rounded-0" role="alert">
          <i className="bx bx-error-circle me-2" />
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
        <button type="submit" className="btn btn-white btn-ecomm rounded-0" disabled={!stripe || isProcessing}>
          {isProcessing ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" />
              Processing Payment...
            </>
          ) : (
            <>
              <i className="bx bx-lock-alt me-2" />
              Pay ${amount.toFixed(2)}
            </>
          )}
        </button>
      </div>

      <div className="mt-3 text-center">
        <small className="text-muted">By confirming your payment, you agree to our terms and conditions</small>
      </div>

      {process.env.NODE_ENV === 'development' && (
        <div className="alert alert-info mt-3 rounded-0">
          <small>
            <strong>Test Card:</strong> 4242 4242 4242 4242
            <br />
            <strong>Expiry:</strong> Any future date
            <br />
            <strong>CVC:</strong> Any 3 digits
          </small>
        </div>
      )}
    </form>
  );
}

/** Public export — wraps the inner form with its own `<Elements>` provider. */
export default function StripePaymentForm(props: StripePaymentFormProps) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret: props.clientSecret }}>
      <InnerForm {...props} />
    </Elements>
  );
}
