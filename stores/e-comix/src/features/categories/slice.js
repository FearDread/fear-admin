import { FeatureFactory } from "@feardread/feature-factory";

const { reducer: categoryReducer, asyncActions: fetchCategory } = FeatureFactory('category', 'all', {});

export { categoryReducer, fetchCategory };