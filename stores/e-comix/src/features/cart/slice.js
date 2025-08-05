import { FeatureFactory } from "@feardread/feature-factory";
import { ThunkFactory } from "@feardread/feature-factory";

export const addToCart = ThunkFactory.post('cart', 'new');
export const getUserCart = ThunkFactory.post('cart', 'user');

export const { slice: cartSlice, asyncActions: Cart } = FeatureFactory('cart').create({ 
    service: { addToCart, getUserCart }
});

export default { cartSlice, Cart };