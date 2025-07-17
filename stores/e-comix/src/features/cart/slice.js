import { FeatureFactory } from "../factory";
import { cartService } from "./service";

export const { slice: cartSlice, asyncActions: Cart } = FeatureFactory('cart').create({
     service: cartService
});

export default { cartSlice, Cart };