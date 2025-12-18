// features/categories/categorySlice.js
import { FeatureFactory } from '@feardread/feature-factory';
import { brandService } from "./service";

const brandFactory = FeatureFactory('brands', brandService);
const { slice, asyncActions: Brands } = brandFactory.createBasic();

export default { brandReducer: slice.reducer, Brands };