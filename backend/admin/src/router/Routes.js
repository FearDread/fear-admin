import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Dashboard from "../pages/Dashboard";
import ProductList from "../pages/dashboard/ProductList";
import OrderList from "../pages/dashboard/OrderList";
import Wizard from "../pages/dashboard/Wizard/Wizard";
import Calendar from "../pages/dashboard/Calendar";
import BlogList from "../pages/dashboard/BlogList.jsx";
import BrandsList from "../pages/dashboard/BrandsList.jsx";
import CategoryList from "../pages/dashboard/CategoryList.jsx";
import UserList from "../pages/dashboard/UserList.jsx";
import ProfilePage from "../pages/dashboard/Profile/Profile.jsx";
import ReviewList from "../pages/dashboard/ReviewList.jsx";
import ProductView from "../pages/dashboard/ProductView.jsx";
import ProductEdit from "../pages/dashboard/ProductEdit.jsx";
import Ebay from "../pages/integrations/Ebay.jsx";
import GoogleAnalytics from "../pages/integrations/Analytics.jsx";

export const routes = {
  auth: [
    { path: "/auth/login", label: 'Login', element: <Login /> },
    { path: "/auth/register", label: 'Register', element: <Register /> },
  ],
  admin: [
    { path: "/admin/dashboard", label: "Dashboard", icon: 'zmdi zmdi-view-dashboard', element: <Dashboard /> },
    { path: "/admin/users", label: "Users", icon: "fa fa-user", element: <UserList /> },
    { path: "/admin/products", label: "Products", icon: "fa fa-shopping-bag", element: <ProductList /> },
    { path: "/admin/reviews", label: "Reviews", icon: "fa fa-star", element: <ReviewList /> },
    { path: "/admin/orders", label: "Orders", icon: "fa fa-shopping-cart", element: <OrderList /> },
    { path: "/admin/blog", label: "Blog", icon: "fa fa-book", element: <BlogList /> },
    { path: "/admin/brand", label: "Brands", icon: "fa fa-certificate", element: <BrandsList /> },
    { path: "/admin/category", label: "Categories", icon: "fa fa-tag", element: <CategoryList /> },
    { path: "/admin/calendar", label: "Calendar", icon: "fa fa-calendar", element: <Calendar /> },
    { path: "/admin/profile", element: <ProfilePage /> },
    { path: "/admin/product/new", element: <Wizard type="product" /> },
    { path: "/admin/blog/new", element: <Wizard type="blog" /> },
  ],
  views: [
    { path: "/admin/product/edit/:id", element: <ProductEdit /> },
    { path: "/admin/product/view/:id", element: <ProductView /> }
  ],
  apps: [
    { path: "/admin/ebay", label: 'EBay', icon: 'fa fa-dollar', element: <Ebay /> },
    { path: "/admin/analytics", label: 'Analytics', icon: 'zmdi zmdi-google', element: <GoogleAnalytics /> }
  ]
};

export default routes;