'use client';

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