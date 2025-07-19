import FeatureFactory from "../factory";
import authService from "./service"
import ThunkFactory from "../factory/thunk";


export const { slice: authSlice, asyncActions: Auth } = FeatureFactory('user').create({
     service: authService 
});

Auth.login = ThunkFactory.create('auth', 'login');
Auth.register = ThunkFactory.create('auth', 'register');

export default { authSlice, Auth };