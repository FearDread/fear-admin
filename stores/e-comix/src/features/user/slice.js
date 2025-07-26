import FeatureFactory from "../factory";
import ThunkFactory from "../factory/thunk";

export const login = ThunkFactory.post('user', 'login');
export const logout = ThunkFactory.post('user', 'logout');
export const register = ThunkFactory.post('user', 'register');

export const { slice: userSlice, asyncActions: User } = FeatureFactory('user').create({
    service: { login, logout, register }
});

export default { userSlice, User };