import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Nav, Collapse } from "reactstrap";
import routes from "../../router/routes";

export const Sidebar = (props) => {
  const [state, setState] = React.useState({});
  const sidebarRef = React.useRef(null);
  const location = useLocation();
  React.useEffect(() => {
    setState(getCollapseStates(props.routes));
  }, []);
    // this creates the intial state of this component based on the collapse routes
  // that it gets through props.routes
  const getCollapseStates = (routes) => {
    let initialState = {};
    routes.admin.map((prop, key) => {
      if (prop.collapse) {
        initialState = {
          [prop.state]: getCollapseInitialState(prop.views),
          ...getCollapseStates(prop.views),
          ...initialState
        };
      }
      return null;
    });
    return initialState;
  };
  // this verifies if any of the collapses should be default opened on a rerender of this component
  // for example, on the refresh of the page,
  // while on the src/views/forms/RegularForms.js - route /admin/regular-forms
  const getCollapseInitialState = (routes) => {
    for (let i = 0; i < routes.length; i++) {
      if (routes.admin[i].collapse && getCollapseInitialState(routes[i].views)) {
        return true;
      } else if (window.location.href.indexOf(routes[i].path) !== -1) {
        return true;
      }
    }
    return false;
  };
  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = (routes) => {
    const { rtlActive } = props;
    return routes.admin.map((prop, key) => {
      if (prop.redirect) {
        return null;
      }
      if (prop.collapse) {
        var st = {};
        st[prop["state"]] = !state[prop.state];
        return (
          <li
            className={getCollapseInitialState(prop.views) ? "active" : ""}
            key={key}
          >
            <a
              href="#pablo"
              data-toggle="collapse"
              aria-expanded={state[prop.state]}
              onClick={(e) => {
                e.preventDefault();
                setState({ ...state, ...st });
              }}
            >
              {prop.icon !== undefined ? (
                <>
                  <i className={prop.icon} />
                  <p>
                    {rtlActive ? prop.rtlName : prop.name}
                    <b className="caret" />
                  </p>
                </>
              ) : (
                <>
                  <span className="sidebar-mini-icon">
                    {rtlActive ? prop.rtlMini : prop.mini}
                  </span>
                  <span className="sidebar-normal">
                    {rtlActive ? prop.rtlName : prop.name}
                    <b className="caret" />
                  </span>
                </>
              )}
            </a>
            <Collapse isOpen={state[prop.state]}>
              <ul className="nav">{createLinks(prop.views)}</ul>
            </Collapse>
          </li>
        );
      }
      return (
        <li className={activeRoute(prop.layout + prop.path)} key={key}>
          <Link
            to={prop.layout + prop.path}
            activeClassName=""
            onClick={props.closeSidebar}
          >
            {prop.icon !== undefined ? (
              <>
                <i className={prop.icon} />
                <p>{rtlActive ? prop.rtlName : prop.name}</p>
              </>
            ) : (
              <>
                <span className="sidebar-mini-icon">
                  {rtlActive ? prop.rtlMini : prop.mini}
                </span>
                <span className="sidebar-normal">
                  {rtlActive ? prop.rtlName : prop.name}
                </span>
              </>
            )}
          </Link>
        </li>
      );
    });
  };
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname === routeName ? "active" : "";
  };
  const menuItems = [
    { icon: 'zmdi zmdi-view-dashboard', label: 'Dashboard', href: '#' },
    { icon: 'zmdi zmdi-invert-colors', label: 'UI Icons', href: '#' },
    { icon: 'zmdi zmdi-format-list-bulleted', label: 'Forms', href: '#' },
    { icon: 'zmdi zmdi-grid', label: 'Tables', href: '#' },
    { icon: 'zmdi zmdi-calendar-check', label: 'Calendar', href: '#', badge: 'New' },
    { icon: 'zmdi zmdi-face', label: 'Profile', href: '#' },
    { icon: 'zmdi zmdi-lock', label: 'Login', href: '#' },
    { icon: 'zmdi zmdi-account-circle', label: 'Registration', href: '#' }
  ];

  const labels = [
    { icon: 'zmdi zmdi-coffee text-danger', label: 'Important' },
    { icon: 'zmdi zmdi-chart-donut text-success', label: 'Warning' },
    { icon: 'zmdi zmdi-share text-info', label: 'Information' }
  ];

  return (
    <>
      <div id="sidebar-wrapper" data-simplebar="" data-simplebar-auto-hide="true">
        <div className="brand-logo">
          <Link to="/admin/dashboard">
            { /*<img src="assets/images/logo-icon.png" className="logo-icon" alt="logo icon" /> */}
            <h5 className="logo-text">FEAR Admin</h5>
          </Link>
        </div>

        <ul className="sidebar-menu do-nicescrol">
          <li className="sidebar-header">MAIN NAVIGATION</li>
          {routes.admin.map((item, idx) => (
            <li key={idx}>
              <Link to={item.path}>
                <i className={item.icon}></i> <span className="ms-2">{item.label}</span>
                {item.badge && <span className="badge bg-light text-light float-end">{item.badge}</span>}
              </Link>
            </li>
          ))}
          <li className="">Labels</li>
          {labels.map((item, idx) => (
            <li key={idx}>
              <Link to="#">
                <i className={item.icon}></i> <span className="ms-2">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
