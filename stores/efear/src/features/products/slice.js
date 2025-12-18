// features/products/productSlice.js
import { FeatureFactory } from '@feardread/feature-factory';
import ProductService from "./service";

export const productFactory = FeatureFactory('product', ProductService);

export const { slice, asyncActions: Product } = productFactory.create({
  operations: { fetch: true, search: true, fetchOne: true },
  includeCommonReducers: true
});

export const selectProducts = state => state.products.data;

// Export reducer
export default { reducer: slice.reducer, Product } ;