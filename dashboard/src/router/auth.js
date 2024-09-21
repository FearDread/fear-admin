import Login from "views/pages/Login.jsx";
import Register from "views/pages/Register.jsx";
import Pricing from "views/pages/Pricing.js";
import Lock from "views/pages/Lock.js";

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
  {
    path: "/pricing",
    name: "Pricing",
    component: Pricing,
    layout: "/auth"
  },
  {
    path: "/lock",
    name: "Lock",
    component: Lock,
    layout: "/auth"
  },
];

export default routes;