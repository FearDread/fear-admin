import { FeatureFactory } from "../factory";

export const { slice: categorySlice, asyncActions: Category } = FeatureFactory('category').create();

export default { categorySlice, Category };