import { FeatureFactory } from "@feardread/feature-factory";
import { cartService } from "./service";

const { reducer: cartReducer, asyncActions: cart } = FeatureFactory('cart', 'user', { service: cartService });

export { cartReducer, cart };