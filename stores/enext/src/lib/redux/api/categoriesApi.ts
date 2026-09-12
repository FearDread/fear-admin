import { apiSlice } from './apiSlice';

export interface Category {
  _id?: string;
  id?: string;
  title?: string;
  name?: string;
  [key: string]: unknown;
}

interface FearEnvelope<T> {
  result: T[];
  success: boolean;
  message: string;
  count: number;
}

export const categoriesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query<Category[], void>({
      query: () => '/category/all',
      transformResponse: (obj: FearEnvelope<Category>) => obj.result,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Category' as const, id: _id })),
              { type: 'Category' as const, id: 'LIST' },
            ]
          : [{ type: 'Category' as const, id: 'LIST' }],
    }),

    getCategoryById: builder.query<Category, string>({
      query: (id) => `category/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Category', id }],
    }),

    createCategory: builder.mutation<Category, Partial<Category>>({
      query: (body) => ({
        url: 'categories',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),

    updateCategory: builder.mutation<Category, Partial<Category> & { id: string }>({
      query: ({ id, ...patch }) => ({
        url: `category/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Category', id },
        { type: 'Category', id: 'LIST' },
      ],
    }),

    patchCategory: builder.mutation<Category, Partial<Category> & { id: string }>({
      query: ({ id, ...patch }) => ({
        url: `categories/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Category', id },
        { type: 'Category', id: 'LIST' },
      ],
    }),

    deleteCategory: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Category', id },
        { type: 'Category', id: 'LIST' },
      ],
    }),

    searchCategories: builder.query<Category[], string>({
      query: (term) => ({
        url: 'categories/search',
        params: { q: term },
      }),
      providesTags: [{ type: 'Category', id: 'SEARCH' }],
    }),
  }),
  overrideExisting: false,
});

// Re-exported under the original generic names — see productsApi.ts for why.
export const {
  useGetAllCategoriesQuery,
  useGetCategoryByIdQuery,
  useGetAllCategoriesQuery: useGetAllQuery,
  useGetCategoryByIdQuery: useGetByIdQuery,
  useCreateCategoryMutation: useCreateMutation,
  useUpdateCategoryMutation: useUpdateMutation,
  usePatchCategoryMutation: usePatchMutation,
  useDeleteCategoryMutation: useDeleteMutation,
  useSearchCategoriesQuery: useSearchQuery,
} = categoriesApi;
