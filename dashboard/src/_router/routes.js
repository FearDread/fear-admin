import Calendar from "views/Calendar.js";
import Charts from "views/Charts.js";
import SweetAlert from "views/components/SweetAlert.js";
import Notifications from "views/Notification.js";
import Grid from "views/components/Grid.js";
import Pricing from "views/pages/Pricing.js";
import Lock from "views/pages/Lock.js";
import RegularForms from "views/forms/RegularForms.js";
import Panels from "views/components/Panels.js";
import Wizard from "views/forms/Wizard.js";
import User from "views/pages/User.jsx";
import Dashboard from "views/Dashboard.jsx";
import UserList from "_dashboard/UserList.jsx";
import Products from "_dashboard/ProductList.jsx";
import NewProduct from "_dashboard/ProductNew.jsx";
//import Profile from "_dashboard/Profile.jsx";
//import ProductReviews from "_dashboard/ProductReviews";
import Login from "views/pages/Login.jsx";
import Register from "views/pages/Register.jsx";
//import OrderList from "_dashboard/OrderList";

const routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    isAdmin: true,
    icon: "tim-icons icon-chart-pie-36",
    component: Dashboard,
    layout: "/admin"
  },
  {
    collapse: true,
    name: "Users",
    icon: "tim-icons icon-molecule-40",
    state: "usersCollapse",
    views:[
      {
        path: "/users",
        name: "Users",
        mini: "U",
        component: UserList,
        layout: "/admin"
      },
      {
        path: "/profile",
        name: "Profile",
        mini: "P",
        component: User,
        layout: "/admin"
      },
      /*
      {
        path: "/customer/:id",
        name: "Add Customer",
        mini: "+",
        component: NewCustomer,
        layout: "/admin"
      },
      */
    ]
  },
  {
    collapse: true,
    name: "Products",
    icon: "tim-icons icon-chart-bar-32",
    state: "productsCollapse",
    views:[
      {
        path: "/products",
        name: "All Products",
        mini: "P",
        component: Products,
        layout: "/admin"
      },
      {
        path: "/product/:id",
        name: " + Add New",
        mini: "A",
        component: NewProduct,
        layout: "/admin"
      },
      {
        path: "/product/reviews",
        name: "+ Reviews",
        mini: "R",
        component: Wizard,
        layout: "/admin"
      }
    ]
  },
  {
    path: "/orders",
    name: "Orders",
    icon: "tim-icons icon-laptop",
    component: RegularForms,
    layout: "/admin"
  },
  {
    collapse: true,
    name: "Pages",
    icon: "tim-icons icon-image-02",
    state: "pagesCollapse",
    views: [
      {
        path: "/register",
        name: "Register",
        mini: "R",
        component: Register,
        layout: "/auth"
      },
      {
        path: "/login",
        name: "Login",
        mini: "L",
        component: Login,
        layout: "/auth"
      },
      {
        path: "/lock",
        name: "Lock",
        mini: "L",
        component: Lock,
        layout: "/auth"
      },
      {
        path: "/pricing",
        name: "Pricing",
        mini: "R",
        component: Pricing,
        layout: "/auth"
      }
    ]
  },
  {
    collapse: true,
    name: "Examples",
    icon: "tim-icons icon-image-02",
    state: "examplesCollapse",
    views: [
      {
        path: "/notifications",
        name: "Notifications",
        mini: "T",
        component: Notifications,
        layout: "/admin"
      },
      {
        path: "/sweet-alert",
        name: "Sweet Altert",
        mini: "T",
        component: SweetAlert,
        layout: "/admin"
      },
      {
        path: "/example-tables",
        name: "Grid Layout",
        mini: "T",
        component: Grid,
        layout: "/admin"
      },
      {
        path: "/example-charts",
        name: "Charts",
        mini: "T",
        component: Charts,
        layout: "/admin"
      },
      {
        path: "/example-calendar",
        name: "Calendar",
        mini: "T",
        component: Calendar,
        layout: "/admin"
      },
    ]
  },
];

export default routes;