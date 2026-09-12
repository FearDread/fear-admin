'use client';

/**
 * AccountClient.tsx
 *
 * Single auth guard + section switch for every account page. Replaces the
 * near-identical `useEffect(() => { if (!isAuthenticated) navigate('/login') }, ...)`
 * block that was copy-pasted at the top of Dashboard.jsx, Orders.jsx,
 * Addresses.jsx, and PaymentMethods.jsx in the CRA app.
 *
 * `location.state` (`{ from: location, message: '...' }`) is replaced with
 * the same `?from=` / `?message=` search-param pattern already used by the
 * auth routes, so `/login` doesn't need two different redirect mechanisms.
 *
 * Auth state comes from `authApi`'s `useCurrentUser()` (backed by
 * `useGetCurrentUserQuery`'s cache) rather than a `userSlice` selector — see
 * `authApi.ts` for why that consolidation happened.
 *
 * Each view component still owns its own hero/breadcrumb markup and renders
 * <AccountSidebar/> itself — the original CRA pages weren't visually
 * consistent (Dashboard/Orders/Details use the styled "dash-/oh-/ud-" hero
 * shell, Addresses/PaymentMethods use plain Bootstrap containers), so
 * forcing a single shared shell here would change more than the routing.
 * That visual unification is a good follow-up, just not part of this pass.
 */

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useCurrentUser } from '@/lib/redux/api/authApi';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { selectCurrentUser } from "@/lib/redux/slices/authSlice";
import type { AccountSection } from '@/app/account/[section]/page';

import DashboardView from '@/components/account/DashboardView';
import OrdersView from '@/components/account/OrdersView';
import AddressesView from '@/components/account/AddressesView';
import PaymentMethodsView from '@/components/account/PaymentMethodsView';
import DetailsView from '@/components/account/DetailsView';

interface AccountClientProps {
    section: AccountSection;
}

const SECTION_VIEWS: Record<AccountSection, React.ComponentType> = {
    dashboard: DashboardView,
    orders: OrdersView,
    addresses: AddressesView,
    'payment-methods': PaymentMethodsView,
    details: DetailsView,
};

export default function AccountClient({ section }: AccountClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { user } = useAppSelector(selectCurrentUser);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            const params = new URLSearchParams({
                from: pathname,
                message: 'Please login to access your account',
            });
            router.replace(`/login`);
        }
    }, [isAuthenticated, loading, pathname, router]);

    // Avoid flashing gated content while the redirect above is in flight.
    if (!loading && !isAuthenticated) return null;

    const View = SECTION_VIEWS[section];
    return <View />;
}