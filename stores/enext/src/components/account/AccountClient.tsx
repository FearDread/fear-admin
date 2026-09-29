'use client';

import { useEffect, type ComponentType } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/lib/redux/hooks';
import {
    selectCurrentUser,
    selectIsAuthenticated,
    selectIsAuthHydrating,
} from '@/lib/redux/slices/authSlice';
import type { AccountSection } from '@/lib/account/sections';

import AccountShell from './AccountShell';
import DashboardView from './DashboardView';
import OrdersView from './OrdersView';
import AddressesView from './AddressesView';
import PaymentMethodsView from './PaymentMethodsView';
import DetailsView from './DetailsView';
import { accountStyles } from './styles';

const SECTION_VIEWS: Record<AccountSection, ComponentType> = {
    dashboard: DashboardView,
    orders: OrdersView,
    addresses: AddressesView,
    'payment-methods': PaymentMethodsView,
    details: DetailsView,
};

/**
 * Single auth guard for every account page. Auth reads come from authSlice
 * (populated by authApi's onQueryStarted handlers) — never by re-firing an
 * authApi hook here. The stylesheet is injected once, here, instead of per view.
 */
export default function AccountClient({ section }: { section: AccountSection }) {
    const router = useRouter();
    const pathname = usePathname();

    const currentUser = useAppSelector(selectCurrentUser);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const isHydrating = useAppSelector(selectIsAuthHydrating);

    useEffect(() => {
        if (!isHydrating && !isAuthenticated) {
            const params = new URLSearchParams({
                from: pathname,
                message: 'Please login to access your account',
            });
            router.replace(`/login?${params.toString()}`);
        }
    }, [isAuthenticated, isHydrating, pathname, router]);

    const ready = !isHydrating && isAuthenticated && !!currentUser;
    const View = SECTION_VIEWS[section];

    return (
        <>
            <style>{accountStyles}</style>
            {ready ? (
                <AccountShell section={section}>
                    <View />
                </AccountShell>
            ) : isHydrating ? (
                <div className="acct-loading" role="status">
                    <div className="acct-loading-spin" />
                    <span className="acct-loading-lbl">Loading account…</span>
                </div>
            ) : null /* redirect to /login in flight — don't flash gated content */}
        </>
    );
}