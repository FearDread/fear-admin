import React from "react";


const Sidebar = ({ isOpen }) => {
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
    <div className={`position-fixed bg-dark text-white ${isOpen ? '' : 'd-none'}`} style={{ width: '250px', height: '100vh', overflowY: 'auto', zIndex: 1000 }}>
      <div className="p-3 border-bottom">
        <div className="d-flex align-items-center">
          <div className="bg-primary rounded-circle" style={{ width: '40px', height: '40px' }}></div>
          <h5 className="mb-0 ms-2 text-white">Dashtreme Admin</h5>
        </div>
      </div>
      <ul className="list-unstyled">
        <li className="px-3 py-2 text-uppercase small text-muted">Main Navigation</li>
        {menuItems.map((item, idx) => (
          <li key={idx}>
            <a href={item.href} className="d-block px-3 py-2 text-white text-decoration-none hover-bg-secondary">
              <i className={item.icon}></i> <span className="ms-2">{item.label}</span>
              {item.badge && <span className="badge bg-light text-dark float-end">{item.badge}</span>}
            </a>
          </li>
        ))}
        <li className="px-3 py-2 text-uppercase small text-muted mt-3">Labels</li>
        {labels.map((item, idx) => (
          <li key={idx}>
            <a href="#" className="d-block px-3 py-2 text-white text-decoration-none">
              <i className={item.icon}></i> <span className="ms-2">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
