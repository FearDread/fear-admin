import { apiSlice } from './apiSlice';

export interface Category {
  _id?: string;
  id?: string;
  title?: string;
  name?: string;
  [key: string]: unknown;
}

export const categoriesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAll: builder.query<Category[], void>({
      query: () => 'categories/all',
      providesTags: (result) =>
        result
          ? [
              ...result.map((item) => ({
                type: 'Category' as const,
                id: item._id ?? item.id,
              })),
              { type: 'Category' as const, id: 'LIST' },
            ]
          : [{ type: 'Category' as const, id: 'LIST' }],
    }),

    getById: builder.query<Category, string>({
      query: (id) => `categories/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Category', id }],
    }),

    create: builder.mutation<Category, Partial<Category>>({
      query: (body) => ({
        url: 'categories',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),

    update: builder.mutation<Category, Partial<Category> & { id: string }>({
      query: ({ id, ...patch }) => ({
        url: `categories/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Category', id },
        { type: 'Category', id: 'LIST' },
      ],
    }),

    patch: builder.mutation<Category, Partial<Category> & { id: string }>({
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

    delete: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Category', id },
        { type: 'Category', id: 'LIST' },
      ],
    }),

    search: builder.query<Category[], string>({
      query: (term) => ({
        url: 'categories/search',
        params: { q: term },
      }),
      providesTags: [{ type: 'Category', id: 'SEARCH' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllQuery,
  useGetByIdQuery,
  useCreateMutation,
  useUpdateMutation,
  usePatchMutation,
  useDeleteMutation,
  useSearchQuery,
} = categoriesApi;