import { FeatureFactory, ThunkFactory } from "@feardread/feature-factory";

export const { slice: blogSlice, asyncActions: Blog } = FeatureFactory('blog').create();

export default { blogSlice, Blog };