import { FeatureFactory } from "@feardread/feature-factory";
import { ThunkFactory } from "@feardread/feature-factory";

export const { slice: categorySlice, asyncActions: Category } = FeatureFactory('category').create();

export default { categorySlice, Category };