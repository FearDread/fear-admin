import FeatureFactory from "../factory";
import ThunkFactory from "../factory/thunk";

export const addToWishlist = ThunkFactory.post('user', 'wishlist');

export const { slice: productSlice, asyncActions: Product } = FeatureFactory('product').create({
    service: { addToWishlist }
});

export default { productSlice, Product };