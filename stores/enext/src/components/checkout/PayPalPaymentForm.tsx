'use client';

import { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import {
  useCreatePayPalOrderMutation,
  useCapturePayPalOrderMutation,
  type PayPalCaptureResult,
} from '@/lib/redux/api/paymentsApi';

/**
 * Flow:
 *   createOrder → POST /paypal/order   { amount, orderId } → { id }
 *   onApprove   → POST /paypal/capture { orderId: data.orderID } → { success }
 *
 * `success === true` means the capture COMPLETED. Anything else is surfaced as
 * an error rather than silently advancing the checkout.
 */

const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

export interface PayPalSuccessResult {
  /** PayPal order id — store this as the payment reference. */
  orderID: string;
  capture: PayPalCaptureResult;
}

interface PayPalPaymentFormProps {
  /** Order total in dollars. */
  amount: number;
  /** Pass once the order exists server-side. */
  orderId?: string;
  disabled?: boolean;
  onSuccess: (result: PayPalSuccessResult) => void;
  onError?: (error: unknown) => void;
}

export default function PayPalPaymentForm({
  amount,
  orderId,
  disabled = false,
  onSuccess,
  onError,
}: PayPalPaymentFormProps) {
  const [createPayPalOrder] = useCreatePayPalOrderMutation();
  const [capturePayPalOrder] = useCapturePayPalOrderMutation();
  const [message, setMessage] = useState<{ type: 'error' | 'info'; text: string } | null>(null);

  // PayPal expects a decimal amount; keep it to 2dp to avoid float noise.
  const total = Number(amount.toFixed(2));

  if (!clientId) {
    return (
      <div className="alert alert-danger rounded-0">
        PayPal is not configured (missing NEXT_PUBLIC_PAYPAL_CLIENT_ID).
      </div>
    );
  }

  return (
    <PayPalScriptProvider
      options={{ clientId, currency: 'USD', intent: 'capture', components: 'buttons' }}
    >
      {message && (
        <div className={`alert alert-${message.type === 'error' ? 'danger' : 'info'} rounded-0`} role="alert">
          {message.text}
        </div>
      )}

      <PayPalButtons
        style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' }}
        disabled={disabled || total <= 0}
        // Re-render the buttons when the total changes (e.g. discount applied)
        // so createOrder never closes over a stale amount.
        forceReRender={[total, orderId]}
        createOrder={async () => {
          setMessage(null);
          const order = await createPayPalOrder({ amount: total, orderId }).unwrap();
          if (!order?.id) throw new Error('PayPal order was not created');
          return order.id;
        }}
        onApprove={async (data) => {
          try {
            const capture = await capturePayPalOrder({ orderId: data.orderID }).unwrap();
            if (capture.success !== true) {
              throw new Error('PayPal capture did not complete');
            }
            onSuccess({ orderID: data.orderID, capture });
          } catch (err) {
            setMessage({
              type: 'error',
              text: 'We could not complete your PayPal payment. You have not been charged — please try again.',
            });
            onError?.(err);
          }
        }}
        onCancel={() => setMessage({ type: 'info', text: 'PayPal payment was cancelled.' })}
        onError={(err) => {
          setMessage({ type: 'error', text: 'PayPal ran into a problem. Please try again.' });
          onError?.(err);
        }}
      />
    </PayPalScriptProvider>
  );
}
