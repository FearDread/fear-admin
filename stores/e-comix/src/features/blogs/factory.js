import FeatureFactory from "../factory/factory";

const {reducer: productReducer, asyncActions: product } = FeatureFactory('product', 'all', {})

export { productReducer, product };