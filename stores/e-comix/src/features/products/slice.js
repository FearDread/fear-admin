import FeatureFactory from "../factory";
import ThunkFactory from "../factory/thunk";

const { slice: productSlice, asyncActions: Product } = FeatureFactory('product').create();

Product.addToWishlist = ThunkFactory.post('user', 'wishlist');

export { productSlice, Product };