import { FeatureFactory, ThunkFactory, StateFactory } from "@feardread/feature-factory";

const initialState = StateFactory.forList('product');

// 2. Create custom async actions
const service = {
  getPopularProducts: ThunkFactory.custom('product', 'popular', {
    method: 'GET',
    customUrl: 'products/popular'
  })
};

// 3. Create the feature
const productFeature = FeatureFactory('product', {
  favorite: (state, action) => {
    const product = state.products.find(p => p.id === action.payload);
    if (product) {
      product.isFavorite = !product.isFavorite;
    }
  }
});

// 4. Generate slice and actions
export const { slice: productSlice, asyncActions: Product } = productFeature.create({
  service,
  initialState
});

export default { productSlice, Product };