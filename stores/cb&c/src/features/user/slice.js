import { FeatureFactory, ThunkFactory } from "@feardread/feature-factory";

export const login = ThunkFactory.post('user', 'login');
export const logout = ThunkFactory.post('user', 'logout');
export const register = ThunkFactory.post('user', 'register');
export const updateProfile = ThunkFactory.post('user', 'profile');

export const { slice: userSlice, asyncActions: User } = FeatureFactory('user').create({
    service: { login, logout, register, updateProfile }
});

export default { userSlice, User };