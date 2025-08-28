import { useEffect,   useState } from "react";
import { useSelector } from "react-redux";
import CartBasket from "../Cart/CartBasket";
   
import store from "../../features/store";
import { User } from "../../features/user/slice";

import "./Header.css";

const Header = ({ cartData }) => {
  const [ isLoggedIn, setIsLoggedIn ] = useState(false);
  const { data, success, loading } = useSelector(state => state.user);
  const user = (store.local.has('auth')) ? store.local.get('auth') : undefined;
  
  const logoutHandler = (e) => {
    e.preventDefault();
    setIsLoggedIn(false);
    
    store.local.remove('auth');
    store.dispatch(User.logout());
  }

  useEffect(() => {

    if ( user !== undefined ) {
      setIsLoggedIn(true);
    }

  }, [user, isLoggedIn])

  return (
    <>
      <header className="float-start w-100">
        <nav className="navbar navbar-expand-lg">
          <div className="container container-top">
            <a className="navbar-brand mx-auto mb-4 me-lg-start" href="/">
              <img alt="logo" src="images/ekomix/logo_transparent.png" />
            </a>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                <li className="nav-item dmenu  megamenu-li dropdown shop-mega">
                  <a className="nav-link dropdown-toggle" href="/shop" role="button" data-bs-toggle="dropdown">
                    Shop
                  </a>
                  <div className="dropdown-menu megamenu sm-menu border-top">
                    <div className="row">
                      <div className="col-sm-6 col-lg-4 border-right mb-4">
                        <h6>Popular</h6>
                        <a className="dropdown-item" href="/shop?category=comics">Comics</a>
                        <a className="dropdown-item" href="/shop?category=pokemon cards">Pokemon Cards</a>
                        <a className="dropdown-item" href="/shop?brand=dc">Superhero Comics</a>
                        <a className="dropdown-item" href="/shop?category=trading cards">Trading Cards</a>
                      </div>
                      <div className="col-sm-6 col-lg-4 border-right mb-4">
                        <h6>Special Offers</h6>
                        <a className="dropdown-item" href="/shop">Science Fiction</a>
                        <a className="dropdown-item" href="/shop">Superhero Comics </a>
                        <a className="dropdown-item" href="/shop"> Fantasy Novels </a>
                        <a className="dropdown-item" href="/shop">Art of Comics </a>
                      </div>
                      <div className="col-sm-6 col-lg-4 border-right mb-4">
                        <h6> Best Selling </h6>
                        <a className="dropdown-item" href="/shop"> Fantasy Novels </a>
                        <a className="dropdown-item" href="/shop">Art of Comics </a>
                      </div>
                    </div>
                  </div>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/collection">Collection</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/about">About</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/blog">Blog</a>
                </li>
              </ul>
            </div>
            <div className="right-sction">

              <ul className="d-flex align-items-center">
              { isLoggedIn ? (
                <>
                <li>
                  <a className="right-menu btn logout submit-btn" onClick={logoutHandler}> Logout </a>
                </li>
                <li className="dropdown position-relative mx-3">
                  <button className="btn com-link cart-new-icon whilist" type="button"
                    data-bs-toggle="dropdown" >
                    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="30px" height="30px" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M6.5 2h11a1 1 0 0 1 .8.4L21 6v15a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6l2.7-3.6a1 1 0 0 1 .8-.4zM19 8H5v12h14V8zm-.5-2L17 4H7L5.5 6h13zM9 10v2a3 3 0 0 0 6 0v-2h2v2a5 5 0 0 1-10 0v-2h2z"></path></svg>
                    <span className="nubn">1</span>
                  </button>

                  <CartBasket {...cartData} />

                </li> 
                </>
              ) : (
                <>

                <li>
                  <a data-bs-toggle="modal" data-bs-target="#loginModal" className="right-menu btn submit-btn login"> Login </a>
                </li>
                <li>
                  <a data-bs-toggle="modal" data-bs-target="#registerModal" className="btn right-menu submit-btn signup"> <span> Signup </span> </a>
                </li>
                </>
              )}


                <li>
                  <a data-bs-toggle="offcanvas" data-bs-target="#offcanvasRightmobile" className="btn bargar">
                    <span>
                      <img alt="bargar" src="images/bargur.svg" />
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </>
  )
}

export default Header;