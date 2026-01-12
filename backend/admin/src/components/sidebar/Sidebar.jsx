import React from "react";
import { Link } from "react-router-dom";


export const Sidebar = ({ isOpen }) => {
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
          <a href="index.html">
            <img src="assets/images/logo-icon.png" className="logo-icon" alt="logo icon" />
            <h5 className="logo-text">Dashtreme Admin</h5>
          </a>
        </div>

        <ul className="sidebar-menu do-nicescrol">
          <li className="sidebar-header">MAIN NAVIGATION</li>
          {menuItems.map((item, idx) => (
            <li key={idx}>
              <Link to={item.href}>
                <i className={item.icon}></i> <span className="ms-2">{item.label}</span>
                {item.badge && <span className="badge bg-light text-dark float-end">{item.badge}</span>}
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
