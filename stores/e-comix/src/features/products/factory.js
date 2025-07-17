import FeatureFactory from "../factory";
//import { productService } from "./service";

const factory = FeatureFactory('product');
const {
    slice: productSlice,
    asyncActions: Product
} = factory.create();

console.log('product = ', productSlice);
export { productSlice, Product };