// Layouts
import AnonymousLayout from "../layouts/AnonymousLayout";
import MainLayout from "../layouts/MainLayout";

// Pages
import RegularForms from "views/forms/RegularForms.js";
import Panels from "views/components/Panels.js";

import User from "views/pages/User.js";
import Dashboard from "views/Dashboard.jsx";
import UserList from "_dashboard/UserList.jsx";
import Products from "_dashboard/ProductList.jsx";
import NewProduct from "_dashboard/NewProduct.jsx";
//import Profile from "_dashboard/Profile.jsx";
//import ProductReviews from "_dashboard/ProductReviews";
import Login from "views/pages/Login.jsx";
import Register from "views/pages/Register.jsx";

export const routes = [
{
    layout: AuthLayout,
    routes: [
      {
        name: 'login',
        title: 'Login page',
        component: Login,
        path: '/auth/login',
        isPublic: true,
        mini: "L",
      },
      {
        path: "/register",
        name: "Register",
        mini: "R",
        component: Register,
        layout: "/auth"
      },
    ]
  },
  {
    layout: AdminLayout,
    routes: [
      {
        name: 'home',
        title: 'Home page',
        component: Dashboard,
        path: "/admin/dashboard",
        name: "Dashboard",
        isAdmin: true,
        icon: "tim-icons icon-chart-pie-36",
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
        ]
      },
      {
        path: "/users",
        name: "Users",
        icon: "tim-icons icon-molecule-40",
        component: UserList,
        layout: "/admin"
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
            mini: "R",
            component: NewProduct,
            layout: "/admin"
          },
          {
            path: "/product/reviews",
            name: "Reviews",
            mini: "R",
            component: Panels,
            layout: "/admin"
          }
        ]
      },
      {
        path: "/profile",
        name: "Profile",
        icon: "tim-icons icon-image-02",
        component: User,
        layout: "/admin"
      },
      {
        path: "/orders",
        name: "Orders",
        icon: "tim-icons icon-laptop",
        component: RegularForms,
        layout: "/admin"
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