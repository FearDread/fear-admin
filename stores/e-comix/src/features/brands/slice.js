import { FeatureFactory } from "@feardread/feature-factory";

const { reducer: brandReducer, fetch: fetchBrands } = FeatureFactory('brand', 'all');

export { brandReducer, fetchBrands };