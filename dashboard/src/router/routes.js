import Calendar from "views/pages/Calendar.js";
import Charts from "views/pages/Charts.js";
import Notifications from "views/pages/Notification.js";
import SweetAlert from "views/components/SweetAlert.js";
import Grid from "views/components/Grid.js";
import RegularForms from "views/components/forms/RegularForms.js";
import Wizard from "views/components/forms/Wizard.js";
/* ------------------------------------ */
import User from "views/pages/User.jsx";
import Dashboard from "views/Dashboard.jsx";
import UserList from "_dashboard/UserList.jsx";
import ProductList from "_dashboard/ProductList.jsx";
import NewProduct from "_dashboard/ProductNew.jsx";
//import CouponsList from "_dashboard/CouponsList.jsx";
//import CouponNew from "_dashboard/CouponNew.jsx";
import BrandsList from "_dashboard/BrandsList.jsx";
import BrandNew from "_dashboard/BrandNew.jsx";
//import CategoriesList from "_dashboard/CategoryList.jsx";
//import CategoryNew from "_dashboard/CategoryNew.jsx";


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
    name: "Customers",
    icon: "tim-icons icon-molecule-40",
    state: "usersCollapse",
    views:[
      {
        path: "/users",
        name: "Customer List",
        mini: "U",
        component: UserList,
        layout: "/admin"
      },
      {
        path: "/users/new",
        name: "+ Add Customer",
        mini: "U",
        component: UserList,
        layout: "/admin"
      },
      {
        path: "/profile",
        name: "My Profile",
        mini: "P",
        component: User,
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
        name: " + Product",
        mini: "P",
        component: NewProduct,
        layout: "/admin"
      },
      {
        path: "/product/reviews",
        name: "+ Review",
        mini: "R",
        component: Wizard,
        layout: "/admin"
      },
      {
        path: "/brands",
        name: "All Brands",
        mini: "B",
        component: BrandsList,
        layout: "/admin"
      },
      {
        path: "/brand/new",
        name: " + Brand",
        mini: "B",
        component: BrandNew,
        layout: "/admin"
      },
    ],
  },
      /*
      {
        path: "/category",
        name: "All Categorys",
        mini: "C",
        component: CategoriesList,
        layout: "/admin"
      },
      {
        path: "/category/new",
        name: " + Cateogry",
        mini: "C",
        component: CategoryNew,
        layout: "/admin"
      },
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
    name: "Marketing",
    icon: "tim-icons icon-image-02",
    state: "marketCollapse",
    views: [
      {
        path: "/coupon",
        name: "All Coupons",
        mini: "C",
        component: CouponsList,
        layout: "/admin"
      },
      {
        path: "/coupon/new",
        name: "+ Coupon",
        mini: "C",
        component: CouponNew,
        layout: "/admin"
      }
    ]
  },
  */
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