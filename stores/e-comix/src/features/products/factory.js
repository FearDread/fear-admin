import { FeatureFactory } from "@feardread/feature-factory";
import { productService } from "./service";

const {reducer: productReducer, fetch: fetchProducts } = FeatureFactory('product', 'all', { service: productService })

export { productReducer, fetchProducts };