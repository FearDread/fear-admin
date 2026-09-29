import type { User } from '@/types/user';

/** Backend user records use `_id`; the slice type also allows `id`. */
export const userId = (u?: User | null): string => u?._id ?? u?.id ?? '';

export const fullName = (u?: User | null): string =>
    [u?.firstName, u?.lastName].filter(Boolean).join(' ') || u?.displayName || 'Collector';

export const initials = (u?: User | null): string =>
    `${u?.firstName?.[0] ?? ''}${u?.lastName?.[0] ?? ''}`.toUpperCase() || 'E';

export const avatarUrl = (u?: User | null): string | null => {
    const a = u?.avatar;
    if (!a) return null;
    return typeof a === 'string' ? a : (a.secure_url ?? null);
};

export const formatDate = (d?: string | null, opts?: Intl.DateTimeFormatOptions): string =>
    d
        ? new Date(d).toLocaleDateString('en-US', opts ?? { year: 'numeric', month: 'short', day: 'numeric' })
        : '—';

export const formatMoney = (n?: number | null): string => `$${(n ?? 0).toFixed(2)}`;

export const timeAgo = (d?: string | null): string => {
    if (!d) return 'Recently';
    const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(d).toLocaleDateString();
};

/**
 * RTK Query rejects with `{ status, data }`. Several FEAR routes 404 until the
 * backend lands (changePassword, some orders routes) — say so plainly instead
 * of showing a raw "Not Found".
 */
export function apiErrorMessage(err: unknown, fallback: string): string {
    const e = err as { status?: number | string; data?: { message?: string } } | undefined;
    if (e?.status === 404) return "This feature isn't available yet. Please try again later.";
    return e?.data?.message ?? fallback;
}