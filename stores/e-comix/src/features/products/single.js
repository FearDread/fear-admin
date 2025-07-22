import FeatureFactory from "../factory";
import ThunkFactory from "../factory/thunk";

const { slice: singleProductSlice, asyncActions: SingleProduct } = FeatureFactory('single').create();


export { singleProductSlice, SingleProduct };