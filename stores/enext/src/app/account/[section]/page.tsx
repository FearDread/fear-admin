import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AccountClient from '@/components/account/AccountClient';

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

interface AccountSectionPageProps { params: Promise<{ section: string }> }

export function generateStaticParams() {
    return Object.keys(ACCOUNT_SECTIONS).map((section) => ({ section }));
}

export async function generateMetadata({ params }: AccountSectionPageProps) {
    const { section } = await params;
    const config = ACCOUNT_SECTIONS[section as AccountSection];
    if (!config) return {};

    return {
        title: `${config.title} | eFear`,
        description: config.description,
        // Account pages are private and per-user — never index them.
        robots: { index: false, follow: false },
    };
}

export default async function AccountSectionPage({ params }: AccountSectionPageProps) {
    const { section } = await params;
    if (!(section in ACCOUNT_SECTIONS)) {
        notFound();
    }

    return <AccountClient section={section as AccountSection} />;
}