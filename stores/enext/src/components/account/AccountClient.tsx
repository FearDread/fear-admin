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
 * Auth state comes from `authSlice` (`selectCurrentUser` / `selectIsAuthenticated`
 * / `selectIsAuthHydrating`), which `authApi`'s `onQueryStarted` handlers keep
 * in sync on login/logout/session-hydration. `authApi` itself is only reached
 * for the actual network calls (login, register, logout, session check,
 * password reset, etc.) — components that just need to *read* "who is logged
 * in right now" should pull from the slice, not re-trigger `useGetSessionQuery`
 * or similar here.
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
import { useAppSelector } from '@/lib/redux/hooks';
import {
    selectCurrentUser,
    selectIsAuthenticated,
    selectIsAuthHydrating,
} from '@/lib/redux/slices/authSlice';
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

    // Local reads come straight from authSlice — populated by authApi's
    // onQueryStarted (login/getSession/logout), not re-fetched here.
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

    // Avoid flashing gated content while the session is still hydrating or
    // the redirect above is in flight.
    if (isHydrating || !isAuthenticated || !currentUser) return null;

    const View = SECTION_VIEWS[section];
    return <View />;
}