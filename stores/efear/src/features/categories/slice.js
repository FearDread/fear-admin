// features/categories/categorySlice.js
import { FeatureFactory } from '@feardread/feature-factory';

const reportsFactory = FeatureFactory('categories');
const { slice, asyncActions: Categories } = reportsFactory.createBasic();

export default { categoryReducer: slice.reducer, Categories };