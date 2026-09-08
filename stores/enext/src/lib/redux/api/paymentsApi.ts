import { apiSlice } from '@/lib/redux/api/apiSlice';
import { FearEnvelope as ApiEnvelope } from '@/types/fear';

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
