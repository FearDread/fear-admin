import FeatureFactory from "@feardread/feature-factory";
import userService from "./service";

const { reducer: userReducer, fetch: fetchUser } = FeatureFactory('user', 'profile', { service: userService })

export { userReducer, fetchUser };