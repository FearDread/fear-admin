import { FeatureFactory } from "../factory";
import { ThunkFactory } from "../factory/thunk";

export const addToCart = ThunkFactory.post('cart', 'new');
export const getUserCart = ThunkFactory.post('cart', 'user');

export const { slice: cartSlice, asyncActions: Cart } = FeatureFactory('cart').create({ 
    service: { addToCart, getUserCart }
});

export default { cartSlice, Cart };