import FeatureFactory from "../factory";

const { slice: productSlice, asyncActions: Product } = FeatureFactory('product').create();

export { productSlice, Product };