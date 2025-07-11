import FeatureFactory from "../factory";
import authService from "./service"

const {
    slice: authSlice,
    asyncActions: User
} = FeatureFactory('user').slicer('profile', { service: authService });

export { authSlice, User };