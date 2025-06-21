import { FeatureFactory } from "@feardread/feature-factory";

const { reducer: categoryReducer, asyncActions: category } = FeatureFactory('category', 'all', {});

export { categoryReducer, category };