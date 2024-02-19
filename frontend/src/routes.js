import Dashboard from "views/Dashboard.js";
import UserProfile from "views/UserProfile.js";
import UserList from "views/Admin/UserList";
import ProductList from "views/Admin/ProductList";
import TableList from "views/TableList.js";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "tim-icons icon-chart-pie-36",
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "tim-icons icon-single-02",
    component: UserProfile,
    layout: "/admin",
  },
  {
    path: "/users",
    name: "Users List",
    icon: "tim-icons icon-chart-pie-36",
    component: UserList,
    layout: "/admin",
  },
  {
    path: "/products",
    name: "Product List",
    icon: "tim-icons icon-chart-pie-36",
    component: ProductList,
    layout: "/admin",
  },
  {
    path: "/user-profile",
    name: "Tables",
    icon: "tim-icons icon-single-02",
    component: TableList,
    layout: "/admin",
  },
];
export default routes;
