import { FeatureFactory } from "@feardread/feature-factory";
import { productService } from "./service";

const {reducer: productReducer, asyncActions: product } = FeatureFactory('product', 'all', { service: productService })

export { productReducer, product};