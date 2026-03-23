import { useRouter } from 'expo-router';

/**
 * useNavigation
 *
 * A typed wrapper around expo-router's useRouter, providing named
 * navigation helpers so page components don't need to know route paths.
 *
 * Before (React Router):
 *   const navigate = useNavigate();
 *   navigate('/product/123');
 *
 * After:
 *   const nav = useNavigation();
 *   nav.toProduct('123');
 */
export function useNavigation() {
    const router = useRouter();

    return {
        // ─── Public ─────────────────────────────────────────
        toHome: () => router.push('/(public)'),
        toShop: () => router.push('/(public)/shop'),
        toCart: () => router.push('/(public)/shop/cart'),
        toCategories: () => router.push('/(public)/shop/categories'),
        toProduct: (id: string) => router.push(`/(public)/product/${id}`),
        toComparison: () => router.push('/(public)/product/comparison'),
        toWishlist: () => router.push('/(public)/wishlist'),
        toBlog: () => router.push('/(public)/blog'),
        toBlogPost: (id: string) => router.push(`/(public)/blog/${id}`),
        toAbout: () => router.push('/(public)/about'),
        toContact: () => router.push('/(public)/contact'),
        toFaq: () => router.push('/(public)/faq'),

        // ─── Policy ─────────────────────────────────────────
        toTerms: () => router.push('/(public)/terms'),
        toPrivacy: () => router.push('/(public)/privacy'),
        toReturns: () => router.push('/(public)/returns'),

        // ─── Auth ────────────────────────────────────────────
        toLogin: () => router.replace('/(auth)/login'),
        toRegister: () => router.push('/(auth)/register'),
        toForgotPassword: () => router.push('/(auth)/forgot-password'),
        toResetPassword: (token: string) => router.push(`/(auth)/reset-password/${token}`),

        // ─── Account ─────────────────────────────────────────
        toDashboard: () => router.push('/(protected)/account/dashboard'),
        toOrders: () => router.push('/(protected)/account/orders'),
        toAccountDetails: () => router.push('/(protected)/account/details'),
        toPaymentMethods: () => router.push('/(protected)/account/payment-methods'),
        toAddresses: () => router.push('/(protected)/account/addresses'),

        // ─── Checkout ────────────────────────────────────────
        toCheckout: () => router.push('/(protected)/checkout'),
        toCheckoutShipping: () => router.push('/(protected)/checkout/shipping'),
        toCheckoutPayment: () => router.push('/(protected)/checkout/payment'),
        toCheckoutReview: () => router.push('/(protected)/checkout/review'),
        toCheckoutComplete: () => router.replace('/(protected)/checkout/complete'),

        // ─── Generic ─────────────────────────────────────────
        back: () => router.back(),
        replace: router.replace,
        push: router.push,
    };
}