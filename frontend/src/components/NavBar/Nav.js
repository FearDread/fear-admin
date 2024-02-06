import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signout } from "../../actions/userActions";
import { MenuItems } from "./MenuItems";
import "./NavBar.css";
import { CustomButton } from "../CustomButton/Button";

export default function Nav() {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const dispatch = useDispatch();
  const signoutHandler = () => {
    dispatch(signout());
  };
  const [hidden, setHidden] = useState(false);
  return (
    <div>
      <nav className="NavBarItems">
        <Link className="NavBar-lg" to="/">
          Conceilax
        </Link>
        <div className="menu-icon">
          <i
            onClick={() => setHidden(true)}
            className={hidden ? "fas fa-bars hidden" : "fas fa-bars"}
          ></i>
          <i
            onClick={() => setHidden(false)}
            className={hidden ? "fas fa-times" : "fas fa-times hidden"}
          ></i>
        </div>
        <ul className={hidden ? "nav-menu active" : "nav-menu"}>
          {MenuItems.map((item, index) => {
            return (
              <li key={index}>
                <Link className={item.cName} to={item.to}>
                  {item.title}
                </Link>
              </li>
            );
          })}
          <li>
            {" "}
            {userInfo ? (
              <>
                <Link className="navb-links-mobile" to="/account">
                  Account
                </Link>
                {userInfo && userInfo.isAdmin && (
                  <Link className="navb-links-mobile" to="/signin">
                    Admin
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link className="navb-links-mobile" to="/Signin">
                  Sign in
                </Link>
              </>
            )}
          </li>
        </ul>{" "}
        {userInfo ? (
          <div className="IsActive">
            <div className="dropdown">
              <Link className="optionstop" to="#">
                {userInfo.name} <i className="fa fa-caret-down"></i>{" "}
              </Link>
              <ul className="dropdown-content">
                <li>
                  {userInfo && userInfo.isSeller && (
                    <>
                      <li>
                        <Link className="Optionsdown" to="/productlist/seller">My Products</Link>
                      </li>
                      <li>
                        <Link className="Optionsdown" to="/orderlist/seller">Orders</Link>
                      </li>
                      <div class="navbar-divider"></div>
                    </>
                  )}
                </li>
                <li>
                    <Link className="Optionsdown" to="/profile">Profile</Link>
                  </li>
                  <li>
                    <Link className="Optionsdown" to="/orderhistory">Order History</Link>
                  </li>
                  <div class="navbar-divider"></div>
                <li>
                  <Link
                    className="Optionsdown"
                    to="#signout"
                    onClick={signoutHandler}
                  >
                    Sign Out
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <Link to="/signin">
            <CustomButton>Sign in</CustomButton>
          </Link>
        )}

        {userInfo && userInfo.isAdmin && (
           <div className="IsActive">
          <div className="dropdown">
            <Link  className="optionstop" to="#admin">
              Admin <i className="fa fa-caret-down"></i>
            </Link>
            <ul className="dropdown-content">
              <li>
                <Link className="Optionsdown" to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link className="Optionsdown" to="/productlist">Products</Link>
              </li>
              <li>
                <Link className="Optionsdown" to="/orderlist">Orders</Link>
              </li>
              <li>
                <Link  className="Optionsdown" to="/userlist">Users</Link>
              </li>
            </ul>
          </div>
          </div>
        )}
      </nav>
    </div>
  );
}
