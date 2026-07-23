import { apiSlice } from './apiSlice';

interface SubscribePayload {
  $email: string;
  $subject: string;
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
  }),
  overrideExisting: false,
});

export const { useSubscribeMutation } = mailApi;