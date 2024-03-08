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
//import Notifications from "views/components/Notifications.js";
import Grid from "views/components/Grid.js";
import Typography from "views/components/Typography.js";
import Icons from "views/components/Icons.js";
import Pricing from "views/pages/Pricing.js";
import Timeline from "views/pages/Timeline.js";
import Rtl from "views/pages/Rtl.js";
import Lock from "views/pages/Lock.js";

import RegularForms from "views/forms/RegularForms.js";
import Panels from "views/components/Panels.js";

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
    icon: "tim-icons icon-chart-bar-32",
    state: "usersCollapse",
    views:[
      {
        path: "/users",
        name: "Users",
        icon: "tim-icons icon-molecule-40",
        component: UserList,
        layout: "/admin"
      },
      {
        path: "/profile",
        name: "Profile",
        icon: "tim-icons icon-image-02",
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
        mini: "R",
        component: Products,
        layout: "/admin"
      },
      {
        path: "/product/:id",
        name: "Add New",
        mini: "+",
        component: NewProduct,
        layout: "/admin"
      },
      {
        path: "/product/reviews",
        name: "Reviews",
        mini: "P",
        component: Panels,
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
    name: "Auth Pages",
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
    state: "pagesCollapse",
    views: [
      {
        path: "/example-tables",
        name: "Tables",
        mini: "T",
        component: ReactTables,
        layout: "/admin"
      },
      {
        path: "/example-charts",
        name: "Tables",
        mini: "T",
        component: Charts,
        layout: "/admin"
      },
      {
        path: "/example-calendar",
        name: "Tables",
        mini: "T",
        component: Calendar,
        layout: "/admin"
      },
    ]
  },
];

export default routes;
/*
export const routes = [
  {
      layout: AnonymousLayout,
      routes: [
        {
          name: 'login',
          title: 'Login page',
          component: Login,
          path: '/login',
          isPublic: true,
        }
      ]
    },
  {
      layout: MainLayout,
      routes: [
        {
          name: 'home',
          title: 'Home page',
          component: Home,
          path: '/home'
        },
        {
          name: 'users',
          title: 'Users',
          hasSiderLink: true,
          routes: [
            {
              name: 'list-users',
              title: 'List of users',
              hasSiderLink: true,
              component: ListUsers,
              path: '/users'
            },
            {
              name: 'create-user',
              title: 'Add user',
              hasSiderLink: true,
              component: CreateUser,
              path: '/users/new'
            }
          ]
        }
      ]
    }
  ];
  */