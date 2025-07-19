import { FeatureFactory } from "../factory";
import { ThunkFactory } from "../factory/thunk";

export const { slice: cartSlice, asyncActions: Cart } = FeatureFactory('cart').create();

Cart.addToCart = ThunkFactory.post('user', 'cart')
Cart.getCart = ThunkFactory.create('user', 'cart');
Cart.getUserWishlist = ThunkFactory.create('user', 'wishlist');

export default { cartSlice, Cart };