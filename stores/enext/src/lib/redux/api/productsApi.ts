import { createFeatureApi } from './createFeatureApi';

export const productsApi = createFeatureApi('products').create();

export const {
  useGetAllQuery,
  useGetByIdQuery,
  useCreateMutation,
  useUpdateMutation,
  usePatchMutation,
  useDeleteMutation,
  useSearchQuery,
} = productsApi;