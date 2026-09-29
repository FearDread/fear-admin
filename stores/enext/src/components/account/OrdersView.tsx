'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { useGetOrdersQuery, useCancelOrderMutation } from '@/lib/redux/api/ordersApi';
import { apiErrorMessage, formatDate, formatMoney } from '@/lib/account/helpers';
import {
    byNewest,
    canCancel,
    capitalize,
    countsTowardSpend,
    isActive,
    STATUS_COLOR,
    STATUS_ORDER,
    toOrderView,
    type OrderView,
} from '@/lib/account/orders';
import { T } from './styles';

interface OrderCardProps {
    order: OrderView;
    expanded: boolean;
    confirming: boolean;
    cancelling: boolean;
    onToggle: () => void;
    onAskCancel: () => void;
    onKeep: () => void;
    onCancel: () => void;
}

// Module scope — never declare this inside OrdersView or it remounts on every render.
function OrderCard({ order, expanded, confirming, cancelling, onToggle, onAskCancel, onKeep, onCancel }: OrderCardProps) {
    const color = STATUS_COLOR[order.status] ?? T.border;
    return (
        <div className="acct-order" style={{ '--c': color } as CSSProperties}>
            <div className="acct-order-head">
                <span className="acct-order-num">Order <span>#{order.number}</span></span>
                <span className="acct-pill">{capitalize(order.status)}</span>
            </div>
            <div className="acct-order-body">
                <div><span className="acct-fl">Date</span><span className="acct-fv">{formatDate(order.date)}</span></div>
                <div><span className="acct-fl">Total</span><span className="acct-fv">{formatMoney(order.total)}</span></div>
                <div>
                    <span className="acct-fl">Items</span>
                    <span className="acct-fv">{order.itemCount} item{order.itemCount === 1 ? '' : 's'}</span>
                </div>
                <div className="acct-order-actions">
                    {confirming ? (
                        <>
                            <span className="acct-fl" style={{ margin: 0 }}>Cancel this order?</span>
                            <button className="acct-btn acct-btn--danger acct-btn--sm" onClick={onCancel} disabled={cancelling}>
                                {cancelling ? (<><span className="acct-spinner" /> Cancelling…</>) : 'Yes, cancel'}
                            </button>
                            <button className="acct-btn acct-btn--ghost acct-btn--sm" onClick={onKeep} disabled={cancelling}>Keep</button>
                        </>
                    ) : (
                        <>
                            <button className="acct-btn acct-btn--ghost acct-btn--sm" onClick={onToggle} aria-expanded={expanded}>
                                {expanded ? 'Hide details' : 'View details'}
                            </button>
                            {canCancel(order) && (
                                <button className="acct-btn acct-btn--danger acct-btn--sm" onClick={onAskCancel}>Cancel</button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {expanded && (
                <div className="acct-order-items">
                    {order.items.length === 0 ? (
                        <div className="acct-order-line">No item details available for this order.</div>
                    ) : (
                        order.items.map((item, i) => (
                            <div key={`${item.productId}-${i}`} className="acct-order-line">
                                <span>
                                    <Link href={`/product/${item.productId}`} style={{ color: T.textHi, textDecoration: 'none' }}>
                                        {item.name}
                                    </Link>{' '}
                                    × {item.quantity}
                                </span>
                                <b>{formatMoney(item.price * item.quantity)}</b>
                            </div>
                        ))
                    )}
                    {order.trackingNumber && <div className="acct-order-track">Tracking #: {order.trackingNumber}</div>}
                </div>
            )}
        </div>
    );
}

export default function OrdersView() {
    const { data, isLoading, isError, refetch } = useGetOrdersQuery({ sort: '-orderDate' });
    const [cancelOrder] = useCancelOrderMutation();

    const [filter, setFilter] = useState('all');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [confirmId, setConfirmId] = useState<string | null>(null);
    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [error, setError] = useState('');

    // Derived state — useMemo, not selectors (project convention).
    const orders = useMemo(() => (data ?? []).map(toOrderView).sort(byNewest), [data]);
    const visible = useMemo(() => (filter === 'all' ? orders : orders.filter((o) => o.status === filter)), [orders, filter]);
    const counts = useMemo(() => {
        const c: Record<string, number> = {};
        orders.forEach((o) => { c[o.status] = (c[o.status] ?? 0) + 1; });
        return c;
    }, [orders]);
    const totalSpent = useMemo(() => orders.filter(countsTowardSpend).reduce((s, o) => s + o.total, 0), [orders]);
    const activeCount = useMemo(() => orders.filter(isActive).length, [orders]);
    const presentStatuses = STATUS_ORDER.filter((s) => counts[s]);

    const handleCancel = async (id: string) => {
        setCancellingId(id);
        setError('');
        try {
            await cancelOrder({ orderId: id, reason: 'Customer requested cancellation' }).unwrap();
            setConfirmId(null);
        } catch (err) {
            setError(apiErrorMessage(err, 'Failed to cancel order. Please try again.'));
        } finally {
            setCancellingId(null);
        }
    };

    if (isLoading) {
        return <><div className="acct-skel" /><div className="acct-skel" /><div className="acct-skel" /></>;
    }

    if (isError) {
        return (
            <div className="acct-empty">
                <span className="acct-empty-icon" aria-hidden="true">⚠</span>
                <h3>Couldn&apos;t load orders</h3>
                <p>Something went wrong fetching your order history.</p>
                <button className="acct-btn" onClick={() => refetch()}>Try again</button>
            </div>
        );
    }

    return (
        <>
            <div className="acct-stats">
                {[
                    { val: orders.length, lbl: 'Total Orders', sa: T.red },
                    { val: formatMoney(totalSpent), lbl: 'Total Spent', sa: T.orange },
                    { val: activeCount, lbl: 'Active Orders', sa: T.teal },
                ].map((s) => (
                    <div key={s.lbl} className="acct-stat" style={{ '--sa': s.sa } as CSSProperties}>
                        <span className="acct-stat-val">{s.val}</span>
                        <span className="acct-stat-lbl">{s.lbl}</span>
                    </div>
                ))}
            </div>

            {orders.length > 0 && (
                <div className="acct-chips" role="tablist" aria-label="Filter orders by status">
                    <button role="tab" aria-selected={filter === 'all'} className={`acct-chip${filter === 'all' ? ' active' : ''}`} onClick={() => setFilter('all')}>
                        All<b>{orders.length}</b>
                    </button>
                    {presentStatuses.map((s) => (
                        <button key={s} role="tab" aria-selected={filter === s} className={`acct-chip${filter === s ? ' active' : ''}`} onClick={() => setFilter(s)}>
                            {capitalize(s)}<b>{counts[s]}</b>
                        </button>
                    ))}
                </div>
            )}

            {error && (
                <div className="acct-alert error" role="alert">
                    <span>⚠</span><span>{error}</span>
                    <button onClick={() => setError('')} aria-label="Dismiss">✕</button>
                </div>
            )}

            {visible.length === 0 ? (
                <div className="acct-empty">
                    <span className="acct-empty-icon" aria-hidden="true">📭</span>
                    <h3>No orders found</h3>
                    <p>{filter === 'all' ? "You haven't placed any orders yet." : `No ${filter} orders.`}</p>
                    {filter === 'all' ? (
                        <Link href="/shop" className="acct-btn">Browse the shop</Link>
                    ) : (
                        <button className="acct-btn" onClick={() => setFilter('all')}>Show all orders</button>
                    )}
                </div>
            ) : (
                visible.map((o) => (
                    <OrderCard
                        key={o.id}
                        order={o}
                        expanded={expandedId === o.id}
                        confirming={confirmId === o.id}
                        cancelling={cancellingId === o.id}
                        onToggle={() => setExpandedId(expandedId === o.id ? null : o.id)}
                        onAskCancel={() => setConfirmId(o.id)}
                        onKeep={() => setConfirmId(null)}
                        onCancel={() => handleCancel(o.id)}
                    />
                ))
            )}
        </>
    );
}