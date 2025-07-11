import FeatureFactory from "../factory";
import blogService from "./service";

const {slice: blogSlice, asyncActions: Blog } = FeatureFactory('blog').slicer('all', { service: blogService } );

export { blogSlice, Blog };