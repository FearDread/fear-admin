import { FeatureFactory } from "@feardread/feature-factory";
import { productService } from "./service";
import API from "../api";

const {reducer: productReducer, asyncActions: product } = FeatureFactory('product', 'all', {
     instance: API, 
     service: productService 
})

export { productReducer, product};