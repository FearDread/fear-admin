import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

/* ------------------------------------ */
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
import Ebay from "../pages/integrations/Ebay.jsx";

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
    { path: "/admin/blog/new", element: <Wizard type="blog" /> }
  ],
  apps: [
    { path: "/admin/ebay", label: 'EBay', icon: 'zmdi zmdi-ebay', element: <Ebay />},
    {}
  ]
};

export default routes;