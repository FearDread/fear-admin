import FeatureFactory from "../factory/factory";
import userService from "./service";

const { reducer: authReducer, fetch: fetchUser } = FeatureFactory('auth', 'profile');

export { authReducer, fetchUser, userService };