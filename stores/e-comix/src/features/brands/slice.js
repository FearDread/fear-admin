
import FeatureFactory from "../factory";

export const { slice: brandSlice, asyncActions: Brand } = FeatureFactory('brand').create();

export default { brandSlice, Brand }