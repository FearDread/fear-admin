import FeatureFactory from "../factory";
import authService from "./service"

export const { slice: authSlice, asyncActions: Auth } = FeatureFactory('user').create({
     service: authService 
});

export default { authSlice, Auth };