import VectorMap from "views/maps/VectorMap.js";
import GoogleMaps from "views/maps/GoogleMaps.js";
import FullScreenMap from "views/maps/FullScreenMap.js";
import ReactTables from "views/tables/ReactTables.js";
import RegularTables from "views/tables/RegularTables.js";
import ExtendedTables from "views/tables/ExtendedTables.js";
import Wizard from "views/forms/Wizard.js";
import ValidationForms from "views/forms/ValidationForms.js";
import ExtendedForms from "views/forms/ExtendedForms.js";
import Calendar from "views/Calendar.js";
import Widgets from "views/Widgets.js";
import Charts from "views/Charts.js";
import Buttons from "views/components/Buttons.js";
import SweetAlert from "views/components/SweetAlert.js";
import Notifications from "views/components/Notifications.js";
import Grid from "views/components/Grid.js";
import Typography from "views/components/Typography.js";
import Icons from "views/components/Icons.js";
import Pricing from "views/pages/Pricing.js";
import Timeline from "views/pages/Timeline.js";
import Rtl from "views/pages/Rtl.js";
import Lock from "views/pages/Lock.js";

import RegularForms from "views/forms/RegularForms.js";
import Panels from "views/components/Panels.js";

import User from "views/pages/User.js";
import Dashboard from "views/Dashboard.js";
import UserList from "_dashboard/UserList.jsx";
import Products from "_dashboard/ProductList.jsx";
import NewProduct from "_dashboard/NewProduct.jsx";
//import Profile from "_dashboard/Profile.jsx";
//import ProductReviews from "_dashboard/ProductReviews";
import Login from "views/pages/Login.jsx";
import Register from "views/pages/Register.js";
//import OrderList from "_dashboard/OrderList";

const routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-chart-pie-36",
    component: Dashboard,
    layout: "/admin"
  },
  {
    collapse: true,
    name: "Pages",
    rtlName: "صفحات",
    icon: "tim-icons icon-image-02",
    state: "pagesCollapse",
    views: [
      {
        path: "/register",
        name: "Register",
        rtlName: "عالتسعير",
        mini: "R",
        rtlMini: "ع",
        component: Register,
        layout: "/auth"
      },
      {
        path: "/login",
        name: "Login",
        rtlName: "عالتسعير",
        mini: "L",
        rtlMini: "ع",
        component: Login,
        layout: "/auth"
      },
    ]
  },
  {
    path: "/users",
    name: "Users",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-molecule-40",
    component: UserList,
    layout: "/admin"
  },
  {
    collapse: true,
    name: "Products",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-chart-bar-32",
    state: "productsCollapse",
    views:[
      {
        path: "/products",
        name: "All Products",
        rtlName: "عالتسعير",
        mini: "R",
        rtlMini: "ع",
        component: Products,
        layout: "/admin"
      },
      {
        path: "/product/:id",
        name: "Add New",
        rtlName: "عالتسعير",
        mini: "R",
        rtlMini: "ع",
        component: NewProduct,
        layout: "/admin"
      },
      {
        path: "/product/reviews",
        name: "Reviews",
        rtlName: "عالتسعير",
        mini: "R",
        rtlMini: "ع",
        component: Panels,
        layout: "/admin"
      }
    ]
  },
  {
    path: "/profile",
    name: "Profile",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-image-02",
    component: User,
    layout: "/admin"
  },
  {
    path: "/orders",
    name: "Orders",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-laptop",
    component: RegularForms,
    layout: "/admin"
  },
];

export default routes;
