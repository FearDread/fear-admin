// features/products/productSlice.js
import { FeatureFactory } from '@feardread/feature-factory';
import ProductService from "./service";

export const productFactory = FeatureFactory('product', ProductService);

export const { slice, asyncActions: Product } = productFactory.create({
  operations: { fetch: true, search: true, fetchOne: true },
  includeCommonReducers: true
});

// Export reducer
export default { reducer: slice.reducer, Product } ;