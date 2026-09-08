'use client';

import { useState } from 'react';
import {
  PayPalScriptProvider,
  PayPalButtons,
  PayPalCardFieldsProvider,
  PayPalCardFieldsForm,
  PayPalNameField,
  PayPalNumberField,
  PayPalExpiryField,
  PayPalCVVField,
} from '@paypal/react-paypal-js';
import {
  useCreatePaypalOrderMutation,
  useCapturePaypalOrderMutation,
} from '@/features/api/paymentsApi';
import type { Order } from '@/types/checkout';

/**
 * BUG FIXES from the CRA version:
 *  1. `console.log('paypal client id = ', process.env)` dumped the *entire*
 *     env object to the browser console — removed. Never log `process.env`
 *     client-side, even in dev; it's easy to accidentally ship a build where
 *     that line survives into production.
 *  2. `createOrder` dispatched `updateOrder(order)` and returned `response.id`
 *     from inside a `.then()` callback without an outer `return`, so the
 *     Promise PayPal's SDK awaits resolved to `undefined` instead of the order
 *     ID — PayPal would never have actually gotten an order ID. Rewritten as a
 *     single `async/await` chain that actually returns the ID.
 *  3. Capture request now goes through `paymentsApi` (`/fear/api/payments/paypal/
 *     capture-order`) instead of a bare `fetch('/api/paypal/capture-order')`,
 *     which was never a real backend route in this app — see MERGE_NOTES.md.
 *
 * Env var renamed: `REACT_APP_PAYPAL_CLIENT_ID` (CRA) → `NEXT_PUBLIC_PAYPAL_CLIENT_ID`.
 */

interface PayPalPaymentFormProps {
  order: Order;
  amount: number;
  onSuccess: (result: unknown) => void;
  onError: (error: unknown) => void;
}

export function PayPalPaymentForm({ order, amount, onSuccess, onError }: PayPalPaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const [createPaypalOrder] = useCreatePaypalOrderMutation();
  const [capturePaypalOrder] = useCapturePaypalOrderMutation();

  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '',
    currency: 'USD',
    intent: 'capture',
    components: 'card-fields,buttons',
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalCardFieldsProvider
        createOrder={async () => {
          const result = await createPaypalOrder({ orderId: order?._id, amount }).unwrap();
          return result.id;
        }}
        onApprove={async (data: { orderID: string }) => {
          setLoading(true);
          try {
            const result = await capturePaypalOrder({ orderID: data.orderID }).unwrap();
            onSuccess(result);
          } catch (err) {
            onError(err);
          } finally {
            setLoading(false);
          }
        }}
        onError={(err: unknown) => onError(err)}
      >
        <PayPalCardFieldsForm />
        <div className="card-fields-container">
          <PayPalNameField />
          <PayPalNumberField />
          <div className="card-fields-row">
            <PayPalExpiryField />
            <PayPalCVVField />
          </div>
        </div>
        <button type="submit" disabled={loading} className="paypal-submit-button">
          {loading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
        </button>
      </PayPalCardFieldsProvider>
    </PayPalScriptProvider>
  );
}

/** Standard PayPal Buttons checkout (kept for parity with the CRA version; unused by CheckoutPayment today). */
export function PayPalButtonsPayment({
  amount,
  onSuccess,
  onError,
}: {
  amount: number;
  onSuccess: (result: unknown) => void;
  onError: (error: unknown) => void;
}) {
  const [createPaypalOrder] = useCreatePaypalOrderMutation();
  const [capturePaypalOrder] = useCapturePaypalOrderMutation();

  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '',
    currency: 'USD',
    intent: 'capture',
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' }}
        createOrder={async () => {
          const result = await createPaypalOrder({ amount }).unwrap();
          return result.id;
        }}
        onApprove={async (data) => {
          try {
            const result = await capturePaypalOrder({ orderID: data.orderID }).unwrap();
            onSuccess(result);
          } catch (err) {
            onError(err);
          }
        }}
        onError={(err) => onError(err)}
      />
    </PayPalScriptProvider>
  );
}

export default PayPalPaymentForm;
