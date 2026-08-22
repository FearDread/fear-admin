import { apiSlice } from './apiSlice';

interface SubscribePayload {
  $email: string;
  $subject: string;
}

interface ContactPayload {
  $email: string;
  $subject: string;
  $message: string;
}

export const mailApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    subscribe: builder.mutation<unknown, SubscribePayload>({
      query: (body) => ({
        url: 'mail/subscribe',
        method: 'POST',
        body,
      }),
    }),
    contact: builder.mutation<unknown, ContactPayload>({
      query: (body) => ({
        url: 'mail/contact',
        method: 'POST',
        body,
      })
    }),
  }),
  overrideExisting: false,
});

export const { useSubscribeMutation, useContactMutation } = mailApi;
