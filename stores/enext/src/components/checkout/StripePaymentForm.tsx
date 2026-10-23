'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { loadStripe, type PaymentIntent } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useCreateStripeIntentMutation } from '@/lib/redux/api/paymentsApi';

/**
 * Flow:
 *   1. Outer component POSTs /stripe/intent (via RTK Query) → clientSecret
 *   2. clientSecret is handed to <Elements options={{ clientSecret }}>
 *   3. Inner form renders <PaymentElement/> and calls stripe.confirmPayment
 *
 * The intent is re-created whenever the amount (in cents) or orderId changes,
 * e.g. after a discount code is applied, so the charge never goes stale.
 *
 * NOTE: in React StrictMode (dev only) the effect runs twice and creates two
 * intents. Harmless — the unused one is never confirmed.
 */

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

const APPEARANCE = {
  theme: 'night' as const,
  variables: {
    colorPrimary: '#b30e1c',
    colorBackground: '#141414',
    colorText: 'rgba(255,255,255,0.9)',
    colorDanger: '#e63946',
    fontFamily: 'var(--font-space-mono), monospace',
    borderRadius: '0px',
    spacingUnit: '4px',
  },
};

interface StripePaymentFormProps {
  /** Order total in dollars. */
  amount: number;
  /** Pass once the order exists server-side; the backend links the intent to it. */
  orderId?: string;
  onSuccess: (result: { paymentIntent: PaymentIntent }) => void;
  onError?: (error: unknown) => void;
}

function InnerForm({
  amount,
  onSuccess,
  onError,
}: Pick<StripePaymentFormProps, 'amount' | 'onSuccess' | 'onError'>) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        // Only used if the customer picks a redirect-based method (e.g. bank
        // redirect). Cards resolve in place thanks to redirect: 'if_required'.
        confirmParams: { return_url: `${window.location.origin}/checkout/review` },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'Payment failed. Please try again.');
        onError?.(error);
      } else if (paymentIntent?.status === 'succeeded') {
        onSuccess({ paymentIntent });
      } else {
        // e.g. 'processing' / 'requires_action' that didn't redirect
        setErrorMessage(`Payment status: ${paymentIntent?.status ?? 'unknown'}. Please check your order history.`);
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred. Please try again.');
      onError?.(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>

      {errorMessage && (
        <div className="alert alert-danger rounded-0" role="alert">
          <i className="bx bx-error-circle me-2" />
          {errorMessage}
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <span>Amount to be charged:</span>
        <strong className="h5 mb-0">${amount.toFixed(2)}</strong>
      </div>

      <div className="d-grid">
        <button type="submit" className="btn btn-white btn-ecomm rounded-0" disabled={!stripe || !elements || isProcessing}>
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
            <strong>Test Card:</strong> 4242 4242 4242 4242 · any future expiry · any CVC
          </small>
        </div>
      )}
    </form>
  );
}

export default function StripePaymentForm({ amount, orderId, onSuccess, onError }: StripePaymentFormProps) {
  const cents = Math.round(amount * 100);
  const [createIntent] = useCreateStripeIntentMutation();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    if (cents <= 0) return;
    let cancelled = false;
    setClientSecret(null);
    setInitError(null);

    createIntent({ amount: cents, orderId })
      .unwrap()
      .then((res) => {
        if (!cancelled) setClientSecret(res.clientSecret);
      })
      .catch((err) => {
        if (cancelled) return;
        setInitError('Could not start secure payment. Please refresh and try again.');
        onError?.(err);
      });

    return () => {
      cancelled = true;
    };
    // onError intentionally omitted — parent callbacks are not stable identities.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cents, orderId, createIntent]);

  if (!stripePromise) {
    return (
      <div className="alert alert-danger rounded-0">
        Stripe is not configured (missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY).
      </div>
    );
  }

  if (initError) {
    return <div className="alert alert-danger rounded-0">{initError}</div>;
  }

  if (!clientSecret) {
    return (
      <div className="co-pay-loading">
        <div className="co-pay-spinner" />
        <span className="co-pay-loading-txt">Initialising secure payment...</span>
      </div>
    );
  }

  return (
    // key forces a clean remount when a new intent replaces the old one
    <Elements key={clientSecret} stripe={stripePromise} options={{ clientSecret, appearance: APPEARANCE }}>
      <InnerForm amount={amount} onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
}
