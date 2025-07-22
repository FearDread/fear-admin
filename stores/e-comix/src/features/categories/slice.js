import { FeatureFactory } from "../factory";

const { slice: categorySlice, asyncActions: Category } = FeatureFactory('category').create();

export { categorySlice, Category };