import FeatureFactory from "../factory/factory";
import blogService from "./service";

const {reducer: blogReducer, fetch: fetchBlogs } = FeatureFactory('blog', 'all', { service: blogService });

export { blogReducer, fetchBlogs };