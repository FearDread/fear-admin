'use client';

/**
 * StripeCardForm.tsx
 *
 * Converted from StripeCardForm.jsx. Notable changes:
 *
 *   - `addPayments` thunk → `useAddPaymentMutation` from `paymentsApi`.
 *   - BUG FIX: the original called `onCancel()` unconditionally from
 *     `handleCancel`, but `PaymentMethods.jsx` rendered
 *     `<StripeCardForm onSuccess={onSuccess} currentUser={currentUser} makeDefault={false} />`
 *     without ever passing an `onCancel` prop — clicking Cancel would throw
 *     `onCancel is not a function`. `onCancel` is now a required prop and
 *     `PaymentMethodsView` actually passes one (closes the add-card modal).
 *   - Dead `useNavigate` import removed (it was imported but never used).
 *   - Success/loading are now derived from the mutation itself
 *     (`isLoading`/`isSuccess` on `useAddPaymentMutation`) instead of a
 *     Redux slice with its own success/error/loading fields to keep in sync.
 */

import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAddPaymentMutation } from '@/lib/redux/api/paymentsApi';
import type { CurrentUser } from '@/lib/redux/api/authApi';

interface StripeCardFormProps {
    onSuccess: (result: unknown) => void;
    onCancel: () => void;
    currentUser: CurrentUser | null | undefined;
    makeDefault?: boolean;
}

export const StripeCardForm = ({ onSuccess, onCancel, currentUser, makeDefault = false }: StripeCardFormProps) => {
    const stripe = useStripe();
    const elements = useElements();
    const [addPayment, { isLoading }] = useAddPaymentMutation();

    const [cardholderName, setCardholderName] = useState('');
    const [localError, setLocalError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

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

        setLocalError('');

        try {
            const cardElement = elements.getElement(CardElement);
            if (!cardElement) {
                setLocalError('Card details are missing. Please try again.');
                return;
            }

            const { error: methodError, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
                billing_details: { name: cardholderName, email: currentUser?.email },
            });

            if (methodError) {
                setLocalError(methodError.message || 'Card could not be verified.');
                return;
            }
            if (!paymentMethod?.card) {
                setLocalError('Card could not be verified. Please try again.');
                return;
            }

            const result = await addPayment({
                userId: currentUser._id,
                paymentMethodId: paymentMethod.id, // Stripe token — the only card data that ever leaves the browser
                cardholderName,
                makeDefault,
                cardDetails: {
                    last4: paymentMethod.card.last4,
                    brand: paymentMethod.card.brand,
                    expiryMonth: String(paymentMethod.card.exp_month).padStart(2, '0'),
                    expiryYear: String(paymentMethod.card.exp_year),
                    fingerprint: paymentMethod.card.fingerprint || '',
                },
            }).unwrap();

            onSuccess(result);
        } catch (err: any) {
            setLocalError(err?.data?.message || 'An unexpected error occurred. Please try again.');
            console.error('Payment method creation error:', err);
        }
    };

    const handleCancel = () => {
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
                    disabled={isLoading}
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
                                    '::placeholder': { color: '#aab7c4' },
                                },
                                invalid: { color: '#9e2146' },
                            },
                            hidePostalCode: false,
                            disabled: isLoading,
                        }}
                    />
                </div>
                <small className="text-muted">Your card details are securely processed by Stripe. We never see your full card number.</small>
            </div>

            {localError && (
                <div className="alert alert-danger" role="alert">
                    {localError}
                </div>
            )}

            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={isLoading}>
                    Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={!stripe || isLoading || !cardholderName.trim()}>
                    {isLoading ? (
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

export default StripeCardForm;