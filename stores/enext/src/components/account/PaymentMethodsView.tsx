'use client';

/**
 * PaymentMethodsView.tsx
 *
 * Converted from PaymentMethods.jsx (AccountPayments). Notable changes:
 *
 *   - `fetchPayments` / `removePayments` / `setDefaultMethod` thunks →
 *     `paymentsApi` (RTK Query).
 *   - `<StripeCardForm>` now receives an actual `onCancel` (closes the
 *     modal) — see the bug note in StripeCardForm.tsx for why the original
 *     crashed on Cancel.
 *   - The auth-redirect `useEffect` is gone — handled once in
 *     `AccountClient.tsx`.
 *   - `Elements`/`loadStripe` wiring is added here (the CRA version imported
 *     `loadStripe` but never actually wrapped the form in an `<Elements>`
 *     provider, so Stripe hooks inside `StripeCardForm` would have thrown at
 *     runtime — `useStripe()`/`useElements()` return `null` outside an
 *     `<Elements>` tree).
 */

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import {
    useGetPaymentsQuery,
    useRemovePaymentMutation,
    useSetDefaultPaymentMutation,
} from '@/lib/redux/api/paymentsApi';
import { useCurrentUser } from '@/lib/redux/api/authApi';
import StripeCardForm from './StripeCardForm';
import AccountSidebar from './AccountSidebar';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

const formatExpiry = (month: number, year: number) => `${String(month).padStart(2, '0')}/${String(year).slice(-2)}`;
const isExpired = (method: { expiryMonth: number; expiryYear: number }) => {
    const now = new Date();
    return method.expiryYear < now.getFullYear() || (method.expiryYear === now.getFullYear() && method.expiryMonth < now.getMonth() + 1);
};

export function PaymentMethodsView() {
    const { currentUser } = useCurrentUser();
    const { data: payments = [], isLoading, error } = useGetPaymentsQuery();
    const [removePayment] = useRemovePaymentMutation();
    const [setDefaultPayment] = useSetDefaultPaymentMutation();

    const [showAddModal, setShowAddModal] = useState(false);
    const [deletingMethodId, setDeletingMethodId] = useState<string | null>(null);
    const [makeDefault, setMakeDefault] = useState(false);

    const handleDeleteMethod = async (methodId: string) => {
        if (!window.confirm('Are you sure you want to delete this payment method?')) return;
        setDeletingMethodId(methodId);
        try {
            await removePayment(methodId).unwrap();
        } catch (err: any) {
            alert(err?.data?.message || 'Failed to delete payment method');
        } finally {
            setDeletingMethodId(null);
        }
    };

    const handleSetDefault = async (methodId: string) => {
        try {
            await setDefaultPayment(methodId).unwrap();
        } catch (err: any) {
            alert(err?.data?.message || 'Failed to set default payment method');
        }
    };

    const onCardAdded = () => {
        setShowAddModal(false);
        setMakeDefault(false);
    };

    return (
        <>
            <section className="py-3 border-bottom d-none d-md-flex">
                <div className="container">
                    <div className="page-breadcrumb d-flex align-items-center">
                        <h3 className="breadcrumb-title pe-3">Payment Methods</h3>
                    </div>
                </div>
            </section>

            <section className="py-4">
                <div className="container">
                    <h3 className="d-none">Account</h3>
                    <div className="card-body bg-dark-2">
                        <div className="card-body">
                            <div className="row">
                                <AccountSidebar currentUser={currentUser} />

                                <div className="col-lg-8">
                                    <div className="card shadow-none mb-0">
                                        <div className="card-body">
                                            {error && <div className="alert alert-danger">Failed to load payment methods.</div>}

                                            {isLoading ? (
                                                <div className="text-center py-5">
                                                    <div className="spinner-border text-primary" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                </div>
                                            ) : payments.length === 0 ? (
                                                <div className="text-center py-5">
                                                    <i className="bx bx-credit-card fs-1 text-muted"></i>
                                                    <p className="mt-3">No payment methods saved yet.</p>
                                                    <button onClick={() => setShowAddModal(true)} className="btn btn-dark btn-ecomm rounded-0">
                                                        Add Your First Payment Method
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="table-responsive">
                                                        <table className="table">
                                                            <thead className="table-light">
                                                                <tr>
                                                                    <th>Method</th>
                                                                    <th>Expires</th>
                                                                    <th>Status</th>
                                                                    <th></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {payments.map((method) => (
                                                                    <tr key={method.id}>
                                                                        <td>
                                                                            <div className="d-flex align-items-center">
                                                                                <i className={`bx bxl-${method.cardType?.toLowerCase() || 'credit-card'} fs-4 me-2`}></i>
                                                                                <div>
                                                                                    <div>
                                                                                        {method.cardType || 'Card'} ending in {method.last4}
                                                                                    </div>
                                                                                    {method.isDefault && <span className="badge bg-success">Default</span>}
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            {formatExpiry(method.expiryMonth, method.expiryYear)}
                                                                            {isExpired(method) && <span className="badge bg-danger ms-2">Expired</span>}
                                                                        </td>
                                                                        <td>
                                                                            {method.verified ? (
                                                                                <span className="badge bg-success">Verified</span>
                                                                            ) : (
                                                                                <span className="badge bg-warning">Unverified</span>
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            <div className="d-flex gap-2">
                                                                                <button
                                                                                    onClick={() => handleDeleteMethod(method.id)}
                                                                                    className="btn btn-light btn-sm rounded-0"
                                                                                    disabled={deletingMethodId === method.id}
                                                                                >
                                                                                    {deletingMethodId === method.id ? (
                                                                                        <span className="spinner-border spinner-border-sm"></span>
                                                                                    ) : (
                                                                                        'Delete'
                                                                                    )}
                                                                                </button>
                                                                                {!method.isDefault && (
                                                                                    <button onClick={() => handleSetDefault(method.id)} className="btn btn-light btn-sm rounded-0">
                                                                                        Make Default
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <button onClick={() => setShowAddModal(true)} className="btn btn-light rounded-0">
                                                        <i className="bx bx-plus"></i> Add Payment Method
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {showAddModal && (
                <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Payment Method</h5>
                                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="form-check mb-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="makeDefault"
                                        checked={makeDefault}
                                        onChange={(e) => setMakeDefault(e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="makeDefault">
                                        Make this my default payment method
                                    </label>
                                </div>

                                <Elements stripe={stripePromise}>
                                    <StripeCardForm
                                        onSuccess={onCardAdded}
                                        onCancel={() => setShowAddModal(false)}
                                        currentUser={currentUser}
                                        makeDefault={makeDefault}
                                    />
                                </Elements>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default PaymentMethodsView;