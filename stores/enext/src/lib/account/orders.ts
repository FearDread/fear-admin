import type { Order } from '@/lib/redux/api/ordersApi';
import { T } from '@/components/styles';

/**
 * The orders API returns records in two shapes depending on where they were
 * written: the account list type (`id`, `status`) and the checkout type
 * (`_id`, `orderStatus`). Normalize once here so every account view reads the
 * same fields.
 */
type RawOrder = Order & { _id?: string; orderStatus?: string };

export interface OrderView {
    id: string;
    number: string;
    status: string;
    date?: string;
    total: number;
    items: Order['items'];
    itemCount: number;
    trackingNumber?: string;
}

export function toOrderView(o: Order): OrderView {
    const raw = o as RawOrder;
    const id = raw.id ?? raw._id ?? '';
    const items = raw.items ?? [];
    return {
        id,
        number: raw.orderNumber ?? id,
        status: (raw.status ?? raw.orderStatus ?? 'pending').toLowerCase(),
        date: raw.orderDate ?? raw.createdAt,
        total: raw.total ?? 0,
        items,
        itemCount: items.reduce((s, i) => s + (i.quantity || 0), 0),
        trackingNumber: raw.trackingNumber,
    };
}

export const byNewest = (a: OrderView, b: OrderView) =>
    new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime();

export const STATUS_COLOR: Record<string, string> = {
    completed: T.teal,
    delivered: T.teal,
    shipped: '#4dabf7',
    processing: '#f4a261',
    confirmed: '#f4a261',
    pending: T.textMid,
    failed: T.red,
    cancelled: '#666666',
};

export const STATUS_ORDER = ['pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled', 'failed'];

export const canCancel = (o: OrderView) => o.status === 'pending' || o.status === 'processing';
export const isActive = canCancel;
export const countsTowardSpend = (o: OrderView) => o.status !== 'cancelled' && o.status !== 'failed';

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);