import React from "react";
import { Route, Switch, Redirect, useLocation } from "react-router-dom";
import NotificationAlert from "react-notification-alert";
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import * as Router from "router";
import routes from "router/routes.js";
import logo from "assets/img/FEAR/logo.png";

const Admin = (props) => {
  const [activeColor, setActiveColor] = React.useState("blue");
  const [sidebarMini, setSidebarMini] = React.useState(false);
  const [opacity, setOpacity] = React.useState(0);
  const [sidebarOpened, setSidebarOpened] = React.useState(true);
  const mainPanelRef = React.useRef(null);
  const notificationAlertRef = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.body.classList.remove("sidebar-mini");
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;

    if (mainPanelRef.current) {
      mainPanelRef.current.scrollTop = 0;
    }
  }, [location]);

  React.useEffect(() => {
    let innerMainPanelRef = mainPanelRef;
    if (navigator.platform.indexOf("Win") > -1) {
      mainPanelRef.current &&
        mainPanelRef.current.addEventListener("ps-scroll-y", showNavbarButton);
    }
    window.addEventListener("scroll", showNavbarButton);

    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {

        innerMainPanelRef.current &&
          innerMainPanelRef.current.removeEventListener(
            "ps-scroll-y",
            showNavbarButton
          );
      }
      window.removeEventListener("scroll", showNavbarButton);
    };

  }, []);

  const showNavbarButton = () => {
    if (
      document.documentElement.scrollTop > 50 ||
      document.scrollingElement.scrollTop > 50 ||
      (mainPanelRef.current && mainPanelRef.current.scrollTop > 50)
    ) {
      setOpacity(1);
    } else if (
      document.documentElement.scrollTop <= 50 ||
      document.scrollingElement.scrollTop <= 50 ||
      (mainPanelRef.current && mainPanelRef.current.scrollTop <= 50)
    ) {
      setOpacity(0);
    }
  };

  const handleMiniClick = () => {
    let notifyMessage = "Sidebar mini ";
    if (document.body.classList.contains("sidebar-mini")) {
      setSidebarMini(false);
      notifyMessage += "deactivated...";
    } else {
      setSidebarMini(true);
      notifyMessage += "activated...";
    }
    let options = {};
    options = {
      place: "tr",
      message: notifyMessage,
      type: "primary",
      icon: "tim-icons icon-bell-55",
      autoDismiss: 7
    };
    notificationAlertRef.current.notificationAlert(options);
    document.body.classList.toggle("sidebar-mini");
  };
  const toggleSidebar = () => {
    setSidebarOpened(!sidebarOpened);
    document.documentElement.classList.toggle("nav-open");
  };
  const closeSidebar = () => {
    setSidebarOpened(false);
    document.documentElement.classList.remove("nav-open");
  };
  return (
    <div className="wrapper">
      <div className="rna-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <div className="navbar-minimize-fixed" style={{ opacity: opacity }}>
        <button
          className="minimize-sidebar btn btn-link btn-just-icon"
          onClick={handleMiniClick}
        >
          <i className="tim-icons icon-align-center visible-on-sidebar-regular text-muted" />
          <i className="tim-icons icon-bullet-list-67 visible-on-sidebar-mini text-muted" />
        </button>
      </div>
      <Sidebar
        {...props}
        routes={routes}
        activeColor={activeColor}
        logo={{
          outterLink: "http://fear.master.com/",
          text: "F.E.A.R Admin",
          imgSrc: logo
        }}
        closeSidebar={closeSidebar}
      />
      <div className="main-panel" ref={mainPanelRef} data={activeColor}>
        <AdminNavbar
          {...props}
          handleMiniClick={handleMiniClick}
          brandText={Router.getActiveRoute(routes)}
          sidebarOpened={sidebarOpened}
          toggleSidebar={toggleSidebar}
        />
        <Switch>
          {Router.getRoutes(routes)}
          <Redirect from="*" to="/admin/dashboard" />
        </Switch>
        <Footer />
      </div>
    </div>
  );
};

export default Admin;
