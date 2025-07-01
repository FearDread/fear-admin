import FeatureFactory from "@feardread/feature-factory";
import userService from "./service";

const { reducer: userReducer, asyncActions: user } = FeatureFactory('user', 'profile', { service: userService })

export { userReducer, user };