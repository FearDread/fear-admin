import ApiFactory from "../factory/service";

const userService = ApiFactory('user').create()
userService.inject('login', 'auth/login', 'post');
userService.inject('register', 'auth/register', 'post');



export const {
  useLoginMutation,
  useRegisterMutation,
} = userService;

export default authService;
