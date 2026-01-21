import AuthLayout from "../layouts/Auth";
import AdminLayout from "../layouts/Admin";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

/* ------------------------------------ */
import Dashboard from "../pages/Dashboard";
import ProductList from "../pages/dashboard/ProductList";
import OrderList from "../pages/dashboard/OrderList";
import Wizard from "../pages/dashboard/ProductWizard/Wizard";
import Calendar from "../pages/dashboard/Calendar";
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
import BlogList from "_dashboard/BlogList.jsx";
import BlogNew from "_dashboard/BlogNew.jsx";
import TaskList from "_dashboard/TaskList.jsx";
import TaskNew from "_dashboard/TaskNew.jsx";
import OrderList from "_dashboard/OrderList.jsx";
*/
export const routes = {
  auth: [
    { path: "/auth/login", label: 'Login', element: <Login /> },
    { path: "/auth/register", label: 'Register', element: <Register /> },
    //{ path: "/forgot-password", element: <ForgotPassword /> },
  ],
  admin: [
    { path: "/admin/dashboard", label: "Dashboard", layout: "/admin", icon: 'zmdi zmdi-view-dashboard', element: <Dashboard /> },
    { path: "/admin/products", label: "Products", lalyout: "/admin", icon: "fa fa-certificate", element: <ProductList /> },
    { path: "/admin/orders", label: "Orders", lalyout: "/admin", icon: "fa fa-shopping-cart", element: <OrderList /> },
    { path: "/admin/calendar", label: "Calendar", lalyout: "/admin", icon: "fa fa-calendar", element: <Calendar /> },
    { path: "/admin/product/new", layout: '/admin', element: <Wizard /> }
  ],
};

export default routes;