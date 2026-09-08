/**
 * features/api/paymentsApi.ts
 *
 * NEW API SLICE — replaces `features/payments/slice.js` (`createPaymentIntent` thunk)
 * and the raw `fetch('/api/paypal/...')` calls inline in `PayPalPayment.jsx`.
 *
 * IMPORTANT: the original PayPal component fetched `/api/paypal/create-order` and
 * `/api/paypal/capture-order` directly — those are Next.js-style API routes, not
 * FEAR API routes, and they never appeared anywhere else in the codebase. Since
 * PayPal secret keys must never reach the browser, capture/create MUST happen
 * server-side. Routing them through `/fear/api/payments/paypal/*` (proxied to
 * Express, consistent with every other endpoint in this app) is the correct home —
 * NOT a Next.js Route Handler, which would split payment secrets across two
 * backends. Flagging as a backend gap below.
 *
 * BACKEND GAP — new FEAR API routes needed:
 *   POST /fear/api/payments/create-intent          (Stripe PaymentIntent)
 *   POST /fear/api/payments/paypal/create-order     (PayPal order create)
 *   POST /fear/api/payments/paypal/capture-order    (PayPal order capture)
 *
 * MERGE NOTE: add `'Payment'` to `apiSlice.ts`'s `tagTypes` array if you want to
 * cache/invalidate payment intents; as written below these are pure mutations
 * with no cache entries, which is the right default for one-shot payment calls.
 */
import { apiSlice } from '@/features/api/apiSlice';

interface ApiEnvelope<T> {
  result: T;
  success: boolean;
  message: string;
}

export interface CreatePaymentIntentRequest {
  amount: number; // cents
  currency: string;
  metadata?: Record<string, string | undefined>;
}

export interface PaymentIntentResult {
  id: string;
  client_secret: string;
}

export interface PaypalCreateOrderResult {
  id: string;
}

export interface PaypalCaptureOrderResult {
  id: string;
  status: string;
}

export const paymentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation<PaymentIntentResult, CreatePaymentIntentRequest>({
      query: (body) => ({ url: '/payments/create-intent', method: 'POST', body }),
      transformResponse: (obj: ApiEnvelope<PaymentIntentResult>) => obj.result,
    }),

    createPaypalOrder: builder.mutation<
      PaypalCreateOrderResult,
      { orderId?: string; amount: number }
    >({
      query: (body) => ({ url: '/payments/paypal/create-order', method: 'POST', body }),
      transformResponse: (obj: ApiEnvelope<PaypalCreateOrderResult>) => obj.result,
    }),

    capturePaypalOrder: builder.mutation<PaypalCaptureOrderResult, { orderID: string }>({
      query: (body) => ({ url: '/payments/paypal/capture-order', method: 'POST', body }),
      transformResponse: (obj: ApiEnvelope<PaypalCaptureOrderResult>) => obj.result,
    }),
  }),
});

export const {
  useCreatePaymentIntentMutation,
  useCreatePaypalOrderMutation,
  useCapturePaypalOrderMutation,
} = paymentsApi;
