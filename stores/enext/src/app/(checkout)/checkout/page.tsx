import { redirect } from 'next/navigation';

export default function CheckoutIndexPage() {
    redirect('/checkout/details');
}