import Login from "views/pages/Login.jsx";
import Register from "views/pages/Register.jsx";
import Pricing from "views/pages/Pricing.js";

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