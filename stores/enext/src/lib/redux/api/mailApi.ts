import { createFeatureApi } from './createFeatureApi';

const mailFactory = createFeatureApi('mail');

interface SubscribePayload {
  $email: string;
  $subject: string;
}

export const mailApi = mailFactory.inject('subscribe', {
  method: 'POST',
  url: (entity: string) => `${entity}/subscribe`,
}) as {
  useSubscribeMutation: () => [
    (payload: SubscribePayload) => Promise<unknown>,
    { isLoading: boolean; isSuccess: boolean; isError: boolean; reset: () => void },
  ];
  reducerPath: string;
  reducer: unknown;
  middleware: unknown;
};

export const { useSubscribeMutation } = mailApi;