'use client';

import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useAppSelector } from '@/lib/redux/hooks';
import { selectCurrentUser } from '@/lib/redux/slices/authSlice';
import {
    useGetPaymentsQuery,
    useRemovePaymentMutation,
    useSetDefaultPaymentMutation,
    type PaymentMethod,
} from '@/lib/redux/api/paymentsApi';
import { apiErrorMessage } from '@/lib/account/helpers';
import StripeCardForm from './StripeCardForm';
import { T } from './styles';

// Module scope: loadStripe must not be re-called on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '');

const formatExpiry = (m: number, y: number) => `${String(m).padStart(2, '0')}/${String(y).slice(-2)}`;
const isExpired = (m: PaymentMethod) => {
    const now = new Date();
    return m.expiryYear < now.getFullYear() || (m.expiryYear === now.getFullYear() && m.expiryMonth < now.getMonth() + 1);
};

function AddCardModal({ onClose }: { onClose: () => void }) {
    const currentUser = useAppSelector(selectCurrentUser);
    const [makeDefault, setMakeDefault] = useState(false);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [onClose]);

    return (
        <div className="acct-overlay" role="dialog" aria-modal="true" aria-labelledby="acct-pm-title" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="acct-modal">
                <div className="acct-modal-head">
                    <h3 className="acct-modal-title" id="acct-pm-title">Add payment method</h3>
                    <button className="acct-modal-close" onClick={onClose} aria-label="Close">✕</button>
                </div>
                <div className="acct-modal-body">
                    <label className="acct-check" style={{ marginBottom: '1.25rem' }}>
                        <input type="checkbox" checked={makeDefault} onChange={(e) => setMakeDefault(e.target.checked)} />
                        <span className="acct-check-box" />
                        Make this my default payment method
                    </label>
                    <Elements stripe={stripePromise}>
                        <StripeCardForm onSuccess={onClose} onCancel={onClose} currentUser={currentUser} makeDefault={makeDefault} />
                    </Elements>
                </div>
            </div>
        </div>
    );
}

export default function PaymentMethodsView() {
    const { data: payments = [], isLoading, isError, refetch } = useGetPaymentsQuery();
    const [removePayment] = useRemovePaymentMutation();
    const [setDefaultPayment] = useSetDefaultPaymentMutation();

    const [showAdd, setShowAdd] = useState(false);
    const [confirmId, setConfirmId] = useState<string | null>(null);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [error, setError] = useState('');

    const handleDelete = async (id: string) => {
        setBusyId(id); setError('');
        try {
            await removePayment(id).unwrap();
            setConfirmId(null);
        } catch (err) {
            setError(apiErrorMessage(err, 'Failed to delete payment method.'));
        } finally {
            setBusyId(null);
        }
    };

    const handleDefault = async (id: string) => {
        setBusyId(id); setError('');
        try {
            await setDefaultPayment(id).unwrap();
        } catch (err) {
            setError(apiErrorMessage(err, 'Failed to set default payment method.'));
        } finally {
            setBusyId(null);
        }
    };

    if (isLoading) return <><div className="acct-skel" /><div className="acct-skel" /></>;

    if (isError) {
        return (
            <div className="acct-empty">
                <span className="acct-empty-icon" aria-hidden="true">⚠</span>
                <h3>Couldn&apos;t load cards</h3>
                <p>Something went wrong fetching your saved payment methods.</p>
                <button className="acct-btn" onClick={() => refetch()}>Try again</button>
            </div>
        );
    }

    return (
        <>
            <div className="acct-panel" style={{ '--pa': T.orange } as React.CSSProperties}>
                <div className="acct-panel-head">
                    <h2 className="acct-panel-title">Saved Cards</h2>
                    {payments.length > 0 && (
                        <button className="acct-btn acct-btn--sm" onClick={() => setShowAdd(true)}>+ Add card</button>
                    )}
                </div>
                <div className="acct-panel-body">
                    {error && (
                        <div className="acct-alert error" role="alert">
                            <span>⚠</span><span>{error}</span>
                            <button onClick={() => setError('')} aria-label="Dismiss">✕</button>
                        </div>
                    )}

                    {payments.length === 0 ? (
                        <div className="acct-empty" style={{ border: 'none', padding: '2rem 0' }}>
                            <span className="acct-empty-icon" aria-hidden="true">💳</span>
                            <h3>No saved cards</h3>
                            <p>Add a card for faster checkout. Card numbers go straight to Stripe — we never see them.</p>
                            <button className="acct-btn" onClick={() => setShowAdd(true)}>Add your first card</button>
                        </div>
                    ) : (
                        payments.map((m) => {
                            const expired = isExpired(m);
                            return (
                                <div key={m.id} className={`acct-pm${m.isDefault ? ' default' : ''}`}>
                                    <span className="acct-pm-brand">{m.cardType || 'Card'}</span>
                                    <div className="acct-pm-info">
                                        •••• {m.last4}
                                        <small>
                                            Expires {formatExpiry(m.expiryMonth, m.expiryYear)}
                                            {expired && <> &nbsp;<span className="acct-badge acct-badge--bad">Expired</span></>}
                                            {m.isDefault && <> &nbsp;<span className="acct-badge">Default</span></>}
                                            {!m.verified && !expired && <> &nbsp;<span className="acct-badge acct-badge--warn">Unverified</span></>}
                                        </small>
                                    </div>
                                    <div className="acct-pm-actions">
                                        {confirmId === m.id ? (
                                            <>
                                                <button className="acct-btn acct-btn--danger acct-btn--sm" onClick={() => handleDelete(m.id)} disabled={busyId === m.id}>
                                                    {busyId === m.id ? <span className="acct-spinner" /> : 'Confirm delete'}
                                                </button>
                                                <button className="acct-btn acct-btn--ghost acct-btn--sm" onClick={() => setConfirmId(null)}>Keep</button>
                                            </>
                                        ) : (
                                            <>
                                                {!m.isDefault && (
                                                    <button className="acct-btn acct-btn--ghost acct-btn--sm" onClick={() => handleDefault(m.id)} disabled={busyId === m.id}>
                                                        Make default
                                                    </button>
                                                )}
                                                <button className="acct-btn acct-btn--danger acct-btn--sm" onClick={() => setConfirmId(m.id)}>Delete</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {showAdd && <AddCardModal onClose={() => setShowAdd(false)} />}
        </>
    );
}