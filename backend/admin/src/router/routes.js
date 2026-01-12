/* ------------------------------------ */
import Dashboard from "../pages/Dashboard";

/*
import Profile from "_dashboard/Profile.jsx";
import UserList from "_dashboard/UserList.jsx";
import UserNew from "_dashboard/UserList.jsx";
import Calendar from "_dashboard/Calendar.jsx"
import ProductList from "_dashboard/ProductList.jsx";
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
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

//import CouponsList from "_dashboard/CouponsList.jsx";
//import CouponNew from "_dashboard/CouponNew.jsx";

export const routes = {
  auth: [
    { path: "/auth/login", element: <Login /> },
    { path: "/auth/register", element: <Register /> },
    //{ path: "/forgot-password", element: <ForgotPassword /> },
  ],
  admin: [
    { path: "/admin/dashboard", label: "Dashboard", layout: "/admin", icon: 'zmdi zmdi-view-dashboard', element: <Dashboard /> },
  ],
};

/*
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
    name: "Admin",
    icon: "tim-icons icon-molecule-40",
    state: "usersCollapse",
    views:[
      {
        path: "/profile",
        name: "My Profile",
        mini: "P",
        component: Profile,
        layout: "/admin"
      },
      {
        path: "/users",
        name: "User List",
        
        mini: "U",
        component: UserList,
        layout: "/admin"
      },
      {
        path: "/users/new",
        name: "+ User",
        mini: "U",
        component: Widgits,
        layout: "/admin"
      },
      {
        path: "/task/new",
        name: "+ Task",
        mini: "T",
        component: TaskNew,
        layout: "/admin"
      },
      {
        path: "/events",
        name: "Calendar",
        mini: "C",
        component: Calendar,
        layout: "/admin"
      }
    ]
  },
  {
    collapse: true,
    name: "Catelog",
    icon: "tim-icons icon-chart-bar-32",
    state: "productsCollapse",
    views:[
      {
        path: "/products",
        name: "All Products",
        mini: "P",
        component: ProductList,
        layout: "/admin"
      },
      {
        path: "/product/new",
        name: "+ Product",
        mini: "+",
        component: Wizard,
        layout: "/admin",
      },

      {
        path: "/product/reviews",
        name: "+ Review",
        mini: "+",
        component: Wizard,
        layout: "/admin"
      },

    ]
  },
      {
        collapse: true,
        name: "Brands",
        icon: "tim-icons icon-chart-bar-32",
        state: "brandsCollapse",
        views:[
          {
            path: "/brands",
            name: "All Brands",
            mini: "B",
            component: BrandsList,
            layout: "/admin"
          },
          {
            path: "/brand/new",
            name: "+ Brand",
            mini: "+",
            component: BrandNew,
            layout: "/admin"
          },
        ]
      },
      {
        collapse: true,
        name: "Categories",
        icon: "tim-icons icon-chart-bar-32",
        state: "categoryCollapse",
        views:[
      {
        path: "/categories",
        name: "All Categories",
        mini: "C",
        component: CategoryList,
        layout: "/admin"
      },
      {
        path: "/category/new",
        name: " + Cateogry",
        mini: "+",
        component: CategoryNew,
        layout: "/admin"
      },
    ]
  },

  {
    path: "/orders",
    name: "Orders",
    icon: "tim-icons icon-laptop",
    component: OrderList,
    layout: "/admin"
  },
  {
    collapse: true,
    name: "Marketing",
    icon: "tim-icons icon-image-02",
    state: "marketCollapse",
    views: [
      {
        path: "/coupon",
        name: "All Coupons",
        mini: "C",
        component: Grid,
        layout: "/admin"
      },
      {
        path: "/coupon/new",
        name: "+ Coupon",
        mini: "C",
        component: RegularForms,
        layout: "/admin"
      },
      {
        path: "/blogs",
        name: "All Blogs",
        mini: "B",
        component: BlogList,
        layout: "/admin"
      },
      {
        path: "/blog/new",
        name: "+ Blog",
        mini: "B",
        component: BlogNew,
        layout: "/admin"
      }
    ]
  },
]
*/
export default routes;