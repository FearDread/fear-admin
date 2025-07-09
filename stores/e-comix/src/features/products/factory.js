import FeatureFactory from "../factory/factory";
import { productService } from "./service";

const { reducer: productReducer, fetch: fetchProducts } = FeatureFactory('product', 'all')

export { productReducer, fetchProducts, productService };