import { FeatureFactory } from "@feardread/feature-factory";

const { slice: categorySlice, asyncActions: Category } = FeatureFactory('category').create();

export { categorySlice, Category };