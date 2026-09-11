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
} from '@/lib/redux/api/paymentsApi';
import type { Order } from '@/types/checkout';

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
