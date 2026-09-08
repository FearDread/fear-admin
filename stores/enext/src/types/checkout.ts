/**
 * types/checkout.ts
 *
 * Shared types for the checkout flow (details → shipping → payment → review → complete).
 * MERGE NOTE: reconcile `Address` / `OrderItem` against whatever shape the FEAR API
 * `/orders` routes actually return once they exist (see MERGE_NOTES.md — these are
 * currently unimplemented backend routes).
 */

export interface Address {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
}

export type PaymentStatus = 'pending' | 'completed' | 'failed';
export type OrderStatus = 'pending' | 'processing' | 'confirmed' | 'shipped' | 'delivered';

export interface Order {
  _id?: string;
  orderNumber?: string;
  userId: string;
  items: OrderItem[];

  shippingAddress?: Address;
  billingAddress?: Address;

  shippingMethodId?: string;
  shippingMethod?: string;
  shippingCost?: number;
  estimatedDelivery?: string;

  subtotal: number;
  shipping: number;
  taxes: number;
  discount: number;
  total: number;

  paymentMethod?: 'card' | 'paypal-payment' | 'net-banking';
  paymentIntentId?: string;
  paymentStatus?: PaymentStatus;
  orderStatus?: OrderStatus;

  customerEmail?: string;
  customerName?: string;

  step?: 'details' | 'shipping' | 'payment' | 'review' | 'complete';
  createdAt?: string;
  updatedAt?: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  time: string;
  fee: number;
  description: string;
}

export const TAX_RATE = 0.07;

export const SHIPPING_METHODS: ShippingMethod[] = [
  { id: 'standard', name: 'Standard Shipping', time: '5-7 days', fee: 0, description: 'Free standard shipping' },
  { id: 'express', name: 'Express Shipping', time: '2-3 days', fee: 10.0, description: 'Faster delivery' },
  { id: 'overnight', name: 'Overnight Delivery', time: '1 day', fee: 25.0, description: 'Next day delivery' },
  { id: 'international', name: 'International Shipping', time: '10-15 days', fee: 35.0, description: 'Worldwide delivery' },
];

export const DISCOUNT_CODES: Record<string, number> = {
  SAVE10: 10,
  SAVE20: 20,
  WELCOME15: 15,
  FIRST25: 25,
};
