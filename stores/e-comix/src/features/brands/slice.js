import { FeatureFactory } from "../factory/factory";

const { reducer: brandReducer, fetch: fetchBrands } = FeatureFactory('brand', 'all');

export { brandReducer, fetchBrands };