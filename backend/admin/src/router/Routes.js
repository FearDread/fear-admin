import AuthLayout from "../layouts/Auth";
import AdminLayout from "../layouts/Admin";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

/* ------------------------------------ */
import Dashboard from "../pages/Dashboard";
import ProductList from "../pages/dashboard/ProductList";
import OrderList from "../pages/dashboard/OrderList";
import Wizard from "../pages/dashboard/Wizard/Wizard";
import Calendar from "../pages/dashboard/Calendar";
import BlogList from "../pages/dashboard/BlogList.jsx";
/*
import Profile from "_dashboard/Profile.jsx";
import UserList from "_dashboard/UserList.jsx";
import UserNew from "_dashboard/UserList.jsx";
import Calendar from "_dashboard/Calendar.jsx"

import NewProduct from "_dashboard/ProductNew.jsx";
import BrandsList from "_dashboard/BrandsList.jsx";
import BrandNew from "_dashboard/BrandNew.jsx";
import CategoryList from "_dashboard/CategoryList.jsx";
import CategoryNew from "_dashboard/CategoryNew.jsx";

import BlogNew from "_dashboard/BlogNew.jsx";
import TaskList from "_dashboard/TaskList.jsx";
import TaskNew from "_dashboard/TaskNew.jsx";
import OrderList from "_dashboard/OrderList.jsx";
*/
export const routes = {
  auth: [
    { path: "/auth/login", label: 'Login', element: <Login /> },
    { path: "/auth/register", label: 'Register', element: <Register /> },
  ],
  admin: [
    { path: "/admin/dashboard", label: "Dashboard", icon: 'zmdi zmdi-view-dashboard', element: <Dashboard /> },
    { path: "/admin/products", label: "Products", icon: "fa fa-shopping-bag", element: <ProductList /> },
    { path: "/admin/orders", label: "Orders", icon: "fa fa-shopping-cart", element: <OrderList /> },
    { path: "/admin/blog", label: "Blog", icon: "fa fa-book", element: <BlogList /> },
    { path: "/admin/calendar", label: "Calendar", icon: "fa fa-calendar", element: <Calendar /> },
    { path: "/admin/product/new", element: <Wizard type="product" /> },
    { path: "/admin/blog/new", element: <Wizard type="blog" /> }
  ],
};

export default routes;