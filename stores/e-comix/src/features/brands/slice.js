import { FeatureFactory } from "@feardread/feature-factory";

const { reducer: brandReducer, asyncActions: brand } = FeatureFactory('brand', 'all', {});

export { brandReducer, brand };