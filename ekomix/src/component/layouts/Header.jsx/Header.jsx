import React, { useState, useEffect } from "react";
import ReorderIcon from "@mui/icons-material/Reorder";
import SearchBar from "./Searchbar";
import "./Header.css";

import CartIcon from "./CartIcon";
import FlagSelect from "../../Home/Flag";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "./Sidebar";
import ProfileModal from "./ProfileModel";
import { UserProfile } from "../../../_store/actions/userAction";

function Header() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.userData);
  const [searchBarActive, setSearchBarActive] = useState(false);
  const [country, setCountry] = useState("in");
  const [sideMenu, setSideMenu] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSideBarMenu = () => {
    setSideMenu(!sideMenu);
  };

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };

  const handleSearchButtonClick = () => {
    setSearchBarActive(!searchBarActive);
  };

  const handleSearchInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearchFormSubmit = (event) => {
    event.preventDefault();
    if (searchValue.trim()) {
      history.push(`/products/${searchValue}`);
    } else {
      history.push("/products");
    }
  };

  const handleCrossButtonClick = () => {
    setSearchValue("");
    setSearchBarActive(!searchBarActive);
  };

  useEffect(() => {
    console.log('user data = ', user);
    console.log('is auth = ', isAuthenticated);

    dispatch(UserProfile());
  }, []);

  return (
    <>
      <div className="header">
        <div className="headerTop">
          <div className="headerTopLeft">
            <p>We Offer's Free Shipping </p>
          </div>
          <div className="headerTopRight">
            <div className="headerRetailer">
              <span>
                <LocationOnIcon className="headerRetailer_Svg" />
              </span>
              <span>FIND LOCATION</span>
            </div>

            <div className="headerFlag">
              <span>
                <FlagSelect value={country} onChange={handleCountryChange} />
              </span>
            </div>

            <div className="headerLogin">
              {isAuthenticated ? (
                <Link
                  to="/account"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  <button>My Account</button>
                </Link>
              ) : (
                <Link
                  to="/signup"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  <button>Sign Up</button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* nav */}
        <div className="headerBottom">
          <div className="headerBottom__logo">
            <div className="header_mobile_menu">
              <span>
                <ReorderIcon
                  onClick={() => setSideMenu(!sideMenu)}
                  sx={{
                    fontSize: 29,
                    color: "black",
                    "&:hover": {
                      color: "#e7070f",
                      cursor: "pointer",
                    },
                  }}
                />
                {sideMenu && (
                  <Sidebar
                    handleSideBarMenu={handleSideBarMenu}
                    isAuthenticated={isAuthenticated}
                    user={user}
                  />
                )}
              </span>
              <span>
                <SearchBar
                  searchBarActive={searchBarActive}
                  searchValue={searchValue}
                  handleCrossButtonClick={handleCrossButtonClick}
                  handleSearchButtonClick={handleSearchButtonClick}
                  handleSearchInputChange={handleSearchInputChange}
                  handleSearchFormSubmit={handleSearchFormSubmit}
                />
              </span>
            </div>
          </div>
          {!searchBarActive && (
            <Link to="/">
              <img
                src={require("../../../assets/img/ekomix/logo_transparent.png")}
                alt="logo"
                className="headerBottom__logo_main"
              />
            </Link>
          )}

          {/* navmenu */}

          {!searchBarActive && (
            <div className="headerBottom_navMenu">
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/products">Shop</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
                <li>
                  <Link to="/aboutus">About</Link>
                </li>
              </ul>
            </div>
          )}
          <div className="headerBotttom_icons">
            <div className="search_Bar">
              <SearchBar
                searchBarActive={searchBarActive}
                searchValue={searchValue}
                handleCrossButtonClick={handleCrossButtonClick}
                handleSearchButtonClick={handleSearchButtonClick}
                handleSearchInputChange={handleSearchInputChange}
                handleSearchFormSubmit={handleSearchFormSubmit}
              />
            </div>
            <span>
              <Link
                to="/cart"
                style={{ color: "none", textDecoration: "none" }}
              >
                <CartIcon />
              </Link>
            </span>
            <span>
              <ProfileModal user={user} isAuthenticated={isAuthenticated} />
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
