import Login from "pages/auth/Login";
import Register from "pages/auth/Register";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
    layout: "/auth"
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    layout: "/auth"
  },
];

export default routes;