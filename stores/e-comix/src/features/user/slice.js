import FeatureFactory from "../factory";
import ThunkFactory from "../factory/thunk";

export const { slice: userSlice, asyncActions: User } = FeatureFactory('user').create();

User.login = ThunkFactory.post('user', 'login');
User.logout = ThunkFactory.post('user', 'logout');
User.register = ThunkFactory.post('user', 'register');

userSlice.extraReducers = (builder) => (
    builder.addCase(User.login.fulfilled, (state, action) => {
        state.success = true;
        state.data = action.payload;
    })
)

export default { userSlice, User };