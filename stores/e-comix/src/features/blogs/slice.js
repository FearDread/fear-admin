import FeatureFactory from "../factory";
//import blogService from "./service";

export const { slice: blogSlice, asyncActions: Blog } = FeatureFactory('blog').create();

export default { blogSlice, Blog };