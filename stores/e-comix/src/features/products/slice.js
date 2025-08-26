import { FeatureFactory, ThunkFactory } from "@feardread/feature-factory";

export const addToWishlist = ThunkFactory.post('user', 'wishlist');
export const getSingleProduct = ThunkFactory.create('product', ':id');

export const { slice: productSlice, asyncActions: Product } = FeatureFactory('product').create({
    service: { addToWishlist, getSingleProduct }
});

export default { productSlice, Product };