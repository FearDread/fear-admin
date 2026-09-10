/**
 * app/(account)/[section]/page.tsx
 *
 * Dynamic-segment route for the account area, structured exactly like the
 * auth routes (`(auth)/[...auth]` + a per-mode metadata map) and legal
 * routes (`(legal)/[policy]` + a `POLICIES` config record): a route group
 * (`(account)`) so the segment name doesn't appear in the URL, paired with
 * a single dynamic-segment file (`[section]`) driven by a config record.
 * One route file replaces what was five separate CRA pages
 * (Dashboard / Orders / Addresses / PaymentMethods / UserDetails), all of
 * which shared the same hero + sidebar shell and only swapped the main panel.
 *
 * URLs are now `/dashboard`, `/orders`, `/addresses`, `/payment-methods`,
 * `/details` — no `/account` prefix, same as `/login` and `/privacy` have no
 * `/auth` or `/legal` prefix. All internal links across the account views
 * were updated accordingly (see MERGE_NOTES.md for anything outside this
 * folder that may still point at the old `/account/*` paths).
 *
 * These routes are auth-gated, per-user, and never meant to be indexed, so
 * unlike the product/shop/blog pages there's no ISR here — `dynamic =
 * 'force-dynamic'` opts the segment out of the full-route cache, and
 * `robots: { index: false }` keeps it out of search results. All real
 * interactivity (auth redirect, data fetching, forms) lives client-side in
 * `AccountClient.tsx` — this file only resolves the section, emits metadata,
 * and 404s on anything not in `ACCOUNT_SECTIONS`.
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AccountClient from './AccountClient';

export const dynamic = 'force-dynamic';

export const ACCOUNT_SECTIONS = {
    dashboard: {
        title: 'Account Dashboard',
        description: 'View your orders, wishlist, and account activity at a glance.',
    },
    orders: {
        title: 'My Orders',
        description: 'Track, pay, and manage your eFear order history.',
    },
    addresses: {
        title: 'Addresses',
        description: 'Manage your billing and shipping addresses.',
    },
    'payment-methods': {
        title: 'Payment Methods',
        description: 'Manage the cards saved to your eFear account.',
    },
    details: {
        title: 'Account Details',
        description: 'Update your profile information and password.',
    },
} as const;

export type AccountSection = keyof typeof ACCOUNT_SECTIONS;

interface AccountSectionPageProps {
    params: { section: string };
}

export function generateStaticParams() {
    return Object.keys(ACCOUNT_SECTIONS).map((section) => ({ section }));
}

export function generateMetadata({ params }: AccountSectionPageProps): Metadata {
    const config = ACCOUNT_SECTIONS[params.section as AccountSection];
    if (!config) return {};

    return {
        title: `${config.title} | eFear`,
        description: config.description,
        // Account pages are private and per-user — never index them.
        robots: { index: false, follow: false },
    };
}

export default function AccountSectionPage({ params }: AccountSectionPageProps) {
    if (!(params.section in ACCOUNT_SECTIONS)) {
        notFound();
    }

    return <AccountClient section={params.section as AccountSection} />;
}