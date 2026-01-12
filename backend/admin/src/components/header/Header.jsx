import React, { useEffect } from "react";


onst Header = ({ onToggleSidebar }) => {
  return (
    <header className="bg-dark border-bottom border-secondary">
      <nav className="navbar navbar-expand navbar-dark">
        <ul className="navbar-nav me-auto align-items-center">
          <li className="nav-item">
            <button className="btn btn-link nav-link text-white" onClick={onToggleSidebar}>
              <i className="fas fa-bars"></i>
            </button>
          </li>
          <li className="nav-item">
            <div className="d-flex">
              <input type="text" className="form-control form-control-sm" placeholder="Enter keywords" style={{ width: '300px' }} />
              <button className="btn btn-sm btn-link text-white">
                <i className="fas fa-search"></i>
              </button>
            </div>
          </li>
        </ul>
        
        <ul className="navbar-nav align-items-center">
          <li className="nav-item">
            <a className="nav-link text-white" href="#">
              <i className="far fa-envelope"></i>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white" href="#">
              <i className="far fa-bell"></i>
            </a>
          </li>
          <li className="nav-item dropdown">
            <a className="nav-link text-white" href="#" data-bs-toggle="dropdown">
              <i className="fas fa-flag"></i>
            </a>
          </li>
          <li className="nav-item dropdown">
            <a className="nav-link" href="#" data-bs-toggle="dropdown">
              <img src="https://via.placeholder.com/40x40" className="rounded-circle" alt="user" />
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};
