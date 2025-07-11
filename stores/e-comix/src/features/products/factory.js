import FeatureFactory from "../factory";
import { productService } from "./service";

const { 
    slice: productSlice, 
    asyncActions: Product 
} = FeatureFactory('product').slicer('all', { service: productService });

export { productSlice, Product };