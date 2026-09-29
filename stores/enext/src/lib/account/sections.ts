export const ACCOUNT_SECTIONS = {
    dashboard: {
        heading: ['My','Account'],
        title: 'Account Dashboard',
        description: 'View your orders, wishlist, and account activity at a glance.',
    },
    orders: {
        heading: ['My', 'Orders'],
        title: 'My Orders',
        description: 'Track, pay, and manage your eFear order history.',
    },
    addresses: {
        heading: ['My', 'Addresses'],
        title: 'Addresses',
        description: 'Manage your billing and shipping addresses.',
    },
    'payment-methods': {
        heading: ['My', 'Payment Methods'],
        title: 'Payment Methods',
        description: 'Manage the cards saved to your eFear account.',
    },
    details: {
        heading: ['My', 'Details'],
        title: 'Account Details',
        description: 'Update your profile information and password.',
    },
} as const;

export type AccountSection = keyof typeof ACCOUNT_SECTIONS;