
import FeatureFactory from "../factory";

const { slice: brandSlice, asyncActions: Brand } = FeatureFactory('brand').slicer('all');

export { brandSlice, Brand }