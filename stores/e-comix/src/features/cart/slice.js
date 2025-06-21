import { FeatureFactory } from "@feardread/feature-factory";
import service from "./service";

const { reducer: cartReducer, asyncActions: cart } = FeatureFactory('category', 'all', service);


export { cartReducer, cart };