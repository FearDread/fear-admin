import { FeatureFactory } from "@feardread/feature-factory";
import { productService } from "./service";

const {reducer: productReducer, asyncActions: product, API } = FeatureFactory(
    'product', 'all', {},
     productService
)

export { productReducer, product };