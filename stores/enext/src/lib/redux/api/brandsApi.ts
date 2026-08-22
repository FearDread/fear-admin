import { apiSlice } from '@/lib/redux/api/apiSlice';

export interface Brand {
  _id: string;
  name?: string;
  title?: string;
  logo?: string;
  [key: string]: unknown;
}

interface FearListEnvelope<T> {
  result: T[];
  success: boolean;
  message: string;
  count: number;
}

export const brandsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllBrands: builder.query<Brand[], void>({
      query: () => '/brand/all',
      transformResponse: (obj: FearListEnvelope<Brand>) => obj.result,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Brand' as const, id: _id })),
              { type: 'Brand' as const, id: 'LIST' },
            ]
          : [{ type: 'Brand' as const, id: 'LIST' }],
    }),

    getBrandById: builder.query<Brand, string>({
      query: (id) => `/brand/${id}`,
      transformResponse: (obj: { result: Brand }) => obj.result,
      providesTags: (_result, _error, id) => [{ type: 'Brand' as const, id }],
    }),
  }),
});

export const {
    useGetAllBrandsQuery, 
    useGetBrandByIdQuery 
} = brandsApi;