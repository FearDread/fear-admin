

export const Header = () => {
    return (
        <>
            <div className="top__header pt-30 pb-30">
                <div className="container">
                    <div className="top__wrapper">
                        <a href="index.html" className="main__logo">
                            <img src="assets/images/logo/logo.svg" alt="logo__image">
                        </a>
                        <div className="search__wrp">
                            <input placeholder="Search for" aria-label="Search">
                                <button><i className="fa-solid fa-search"></i></button>
                        </div>
                        <div className="account__wrap">
                            <div className="account d-flex align-items-center">
                                <div className="user__icon">
                                    <a href="#0">
                                        <i className="fa-regular fa-user"></i>
                                    </a>
                                </div>
                                <a href="#0" className="acc__cont">
                                    <span>
                                        My Account
                                    </span>
                                </a>
                            </div>
                            <div className="cart d-flex align-items-center">
                                <span className="cart__icon">
                                    <i className="fa-regular fa-cart-shopping"></i>
                                </span>
                                <a href="#0" className="c__one">
                                    <span>
                                        $0.00
                                    </span>
                                </a>
                                <span className="one">
                                    0
                                </span>
                            </div>
                            <div className="flag__wrap">
                                <div className="flag">
                                    <img src="assets/images/flag/us.png" alt="flag">
                                </div>
                                <select name="flag">
                                    <option value="0">
                                        Usa
                                    </option>
                                    <option value="1">
                                        Canada
                                    </option>
                                    <option value="2">
                                        Australia
                                    </option>
                                    <option value="3">
                                        Germany
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <header className="header-section">
                <div className="container">
                    <div className="header-wrapper">
                        <div className="header-bar d-lg-none">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <ul className="main-menu">
                            <li>
                                <a href="#0">Home <i className="fa-regular fa-angle-down"></i></a>
                                <ul className="sub-menu">
                                    <li className="subtwohober">
                                        <a href="index.html">
                                            Home One
                                        </a>
                                    </li>
                                    <li className="subtwohober">
                                        <a href="index-light.html">
                                            Home One Light
                                        </a>
                                    </li>
                                    <li className="subtwohober">
                                        <a href="index-2.html">
                                            Home Two
                                        </a>
                                    </li>
                                    <li className="subtwohober">
                                        <a href="index-2-light.html">
                                            Home Two Light
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <a href="about.html">About Us</a>
                            </li>
                            <li>
                                <a href="#0">Pages <i className="fa-regular fa-angle-down"></i></a>
                                <ul className="sub-menu">
                                    <li className="subtwohober">
                                        <a href="shop.html">
                                            Shop Leftbar
                                        </a>
                                    </li>
                                    <li className="subtwohober">
                                        <a href="shop-2.html">
                                            Shop Rightbar
                                        </a>
                                    </li>
                                    <li className="subtwohober">
                                        <a href="shop-single.html">
                                            Shop Single
                                        </a>
                                    </li>
                                    <li className="subtwohober">
                                        <a href="cart.html">
                                            Cart Page
                                        </a>
                                    </li>
                                    <li className="subtwohober">
                                        <a href="checkout.html">
                                            Checkout Page
                                        </a>
                                    </li>
                                    <li className="subtwohober">
                                        <a href="register.html">
                                            Register
                                        </a>
                                    </li>
                                    <li className="subtwohober">
                                        <a href="login.html">
                                            Login
                                        </a>
                                    </li>
                                    <li className="subtwohober">
                                        <a href="error.html">
                                            404 Error
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <a href="#0">Blog <i className="fa-regular fa-angle-down"></i></a>
                                <ul className="sub-menu">
                                    <li className="subtwohober">
                                        <a href="blog.html">
                                            Blog Stander
                                        </a>
                                    </li>
                                    <li className="subtwohober">
                                        <a href="blog-grid.html">
                                            Blog Grid
                                        </a>
                                    </li>
                                    <li className="subtwohober">
                                        <a href="blog-list.html">
                                            Blog List
                                        </a>
                                    </li>
                                    <li className="subtwohober">
                                        <a href="blog-single.html">
                                            Blog Single
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <a href="contact.html">Contact Us</a>
                            </li>
                        </ul>
                        <div className="shipping__item d-none d-sm-flex align-items-center">
                            <div className="menu__right d-flex align-items-center">
                                <div className="thumb">
                                    <img src="assets/images/flag/picking.png" alt="image">
                                </div>
                                <div className="content">
                                    <p>
                                        Picking up?
                                    </p>
                                    <div className="items">
                                        <select className="form__select p-0">
                                            <option value="1">
                                                Select Store
                                            </option>
                                            <option value="2">
                                                Store One
                                            </option>
                                            <option value="3">
                                                Store Two
                                            </option>
                                            <option value="3">
                                                Store Three
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="menu__right d-flex align-items-center">
                                <div className="thumb">
                                    <img src="assets/images/flag/shipping.png" alt="image">
                                </div>
                                <div className="content">
                                    <p>
                                        Free Shipping <br> on order <strong>over $100</strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}