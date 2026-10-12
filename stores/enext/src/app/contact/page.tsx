import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const dynamic = 'force-static';

export const metadata: Metadata = {
    title: 'Contact Us',
    description:
        'Questions about an order, a comic, or a collectible? Contact eFear in Killeen, TX by email, phone, or the contact form.',
    alternates: { canonical: '/contact' },
    openGraph: {
        title: 'Contact eFear',
        description:
            'Questions about an order, a comic, or a collectible? Get in touch with eFear in Killeen, TX.',
        url: '/contact',
        type: 'website',
    },
};

export default function ContactPage() {
    return <ContactClient />;
}