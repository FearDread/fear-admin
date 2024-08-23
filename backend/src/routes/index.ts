import cart from "./cart";
import customers from "./customer";
import payment from "./payment";
\
import products from "./product";

import users from "./user";
import mailbag from "./mail";
// import order from "./routes/order";

interface IRoutes {
    cart: typeof cart;
    users: typeof users;
    customers: typeof customers;
    products: typeof products;
    payment: typeof payment;
    mailbag?: typeof mailbag;
}

const IRoutes: IRoutes = {
    cart: cart,
    users: users,
    customers: customers,
    products: products,
    payment: payment,
    // mailbag: mailbag,
};

export default IRoutes;