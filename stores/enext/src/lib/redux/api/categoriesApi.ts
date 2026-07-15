import { createFeatureApi } from './createFeatureApi';

export const categoriesApi = createFeatureApi('categories').create();

export const {
  useGetAllQuery,
  useGetByIdQuery,
  useCreateMutation,
  useUpdateMutation,
  usePatchMutation,
  useDeleteMutation,
  useSearchQuery,
} = categoriesApi;