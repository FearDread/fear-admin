import React, { useState } from 'react';
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

// PayPal with Card Fields (tokenization)
export function PayPalCardPayment({ amount, onSuccess, onError }) {
  const [loading, setLoading] = useState(false);

  const initialOptions = {
    clientId: 'YOUR_PAYPAL_CLIENT_ID',
    currency: 'USD',
    intent: 'capture',
    components: 'card-fields,buttons',
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalCardFieldsProvider
        createOrder={async () => {
          // Create order on your backend
          const response = await fetch('/api/paypal/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount }),
          });
          const order = await response.json();
          return order.id;
        }}
        onApprove={async (data) => {
          setLoading(true);
          try {
            // Capture the order on your backend
            const response = await fetch('/api/paypal/capture-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderID: data.orderID }),
            });
            const result = await response.json();
            onSuccess(result);
          } catch (err) {
            onError(err);
          } finally {
            setLoading(false);
          }
        }}
        onError={(err) => {
          console.error('PayPal error:', err);
          onError(err);
        }}
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
        <button
          type="submit"
          disabled={loading}
          className="paypal-submit-button"
        >
          {loading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
        </button>
      </PayPalCardFieldsProvider>
    </PayPalScriptProvider>
  );
}

// PayPal Buttons (Standard PayPal Checkout)
export function PayPalButtonsPayment({ amount, onSuccess, onError }) {
  const initialOptions = {
    clientId: 'YOUR_PAYPAL_CLIENT_ID',
    currency: 'USD',
    intent: 'capture',
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        style={{
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal',
        }}
        createOrder={async () => {
          const response = await fetch('/api/paypal/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount }),
          });
          const order = await response.json();
          return order.id;
        }}
        onApprove={async (data) => {
          const response = await fetch('/api/paypal/capture-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderID: data.orderID }),
          });
          const result = await response.json();
          onSuccess(result);
        }}
        onError={(err) => {
          console.error('PayPal error:', err);
          onError(err);
        }}
      />
    </PayPalScriptProvider>
  );
}