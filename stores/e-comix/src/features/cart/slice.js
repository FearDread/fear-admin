import { FeatureFactory } from "../factory/factory";
import { cartService } from "./service";

const { reducer: cartReducer, fetch: fetchCart } = FeatureFactory('cart', 'user', { service: cartService });

export { cartReducer, fetchCart, cartService };