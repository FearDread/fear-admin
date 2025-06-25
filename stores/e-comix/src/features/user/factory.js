import FeatureFactory from "@feardread/feature-factory";
import userService from "./service";

const { reducer: userReducer, asyncActions: user } = FeatureFactory('product', 'all', { userService })

export { userReducer, user };