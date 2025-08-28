import { FeatureFactory, ThunkFactory, StateFactory } from "@feardread/feature-factory";

const initialState = StateFactory.forList('user');

const service = {
    login: ThunkFactory.post('user', 'login'),
    logout: ThunkFactory.post('user', 'logout'),
    register: ThunkFactory.post('user', 'register'),
    fetchProfile: ThunkFactory.create('user', 'profile'),
    updateProfile: ThunkFactory.put('user', 'update-profile'),
    changePassword: ThunkFactory.post('user', 'change-password')
};

const userFeature = FeatureFactory('user', {
  setActiveUser: (state, action) => {
    state.activeUser = action.payload;
  },
  clearUsers: (state) => {
    state.data = [];
    state.usersList = [];
  }
});

// Generate the complete feature
export const { slice: userSlice, asyncActions: User } = userFeature.create({
  service,
  initialState
});

export default { userSlice, User };

