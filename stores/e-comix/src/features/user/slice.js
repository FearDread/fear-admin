import FeatureFactory from "../factory";
import authService from "./service"
import ThunkFactory from "../factory/thunk";

export const { slice: authSlice, asyncActions: Auth } = FeatureFactory('user').create();

Auth.login = ThunkFactory.post('auth', 'login');
Auth.register = ThunkFactory.post('auth', 'register');

export default { authSlice, Auth };