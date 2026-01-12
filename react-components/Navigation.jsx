import React from 'react';

function Navigation() {
  return (
    <nav className="navbar navbar-expand fixed-top">
      <ul className="navbar-nav mr-auto align-items-center">
        <li className="nav-item">
          <a className="nav-link toggle-menu" href="javascript:void();">
            <i className="icon-menu menu-icon"></i>
          </a>
        </li>
        <li className="nav-item">
          <form className="search-bar">
            <input type="text" className="form-control" placeholder="Enter keywords" />
            <a href="javascript:void();"><i className="icon-magnifier"></i></a>
          </form>
        </li>
      </ul>
      <ul className="navbar-nav align-items-center right-nav-link">
        <li className="nav-item dropdown-lg">
          <a className="nav-link dropdown-toggle dropdown-toggle-nocaret waves-effect" data-toggle="dropdown" href="javascript:void();">
            <i className="fa fa-envelope-open-o"></i></a>
          </li>
          <li className="nav-item dropdown-lg">
            <a className="nav-link dropdown-toggle dropdown-toggle-nocaret waves-effect" data-toggle="dropdown" href="javascript:void();">
              <i className="fa fa-bell-o"></i></a>
            </li>
            <li className="nav-item language">
              <a className="nav-link dropdown-toggle dropdown-toggle-nocaret waves-effect" data-toggle="dropdown" href="javascript:void();"><i className="fa fa-flag"></i></a>
              <ul className="dropdown-menu dropdown-menu-right">
                <li className="dropdown-item"> <i className="flag-icon flag-icon-gb mr-2"></i> English</li>
                <li className="dropdown-item"> <i className="flag-icon flag-icon-fr mr-2"></i> French</li>
                <li className="dropdown-item"> <i className="flag-icon flag-icon-cn mr-2"></i> Chinese</li>
                <li className="dropdown-item"> <i className="flag-icon flag-icon-de mr-2"></i> German</li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link dropdown-toggle dropdown-toggle-nocaret" data-toggle="dropdown" href="#">
                <span className="user-profile"><img src="https://via.placeholder.com/110x110" className="img-circle" alt="user avatar" /></span>
              </a>
              <ul className="dropdown-menu dropdown-menu-right">
                <li className="dropdown-item user-details">
                  <a href="javaScript:void();">
                    <div className="media">
                      <div className="avatar"><img className="align-self-start mr-3" src="https://via.placeholder.com/110x110" alt="user avatar" /></div>
                      <div className="media-body">
                        <h6 className="mt-2 user-title">Sarajhon Mccoy</h6>
                        <p className="user-subtitle">mccoy@example.com</p>
                      </div>
                    </div>
                  </a>
                </li>
                <li className="dropdown-divider"></li>
                <li className="dropdown-item"><i className="icon-envelope mr-2"></i> Inbox</li>
                <li className="dropdown-divider"></li>
                <li className="dropdown-item"><i className="icon-wallet mr-2"></i> Account</li>
                <li className="dropdown-divider"></li>
                <li className="dropdown-item"><i className="icon-settings mr-2"></i> Setting</li>
                <li className="dropdown-divider"></li>
                <li className="dropdown-item"><i className="icon-power mr-2"></i> Logout</li>
              </ul>
            </li>
          </ul>
        </nav>
  );
}

export default Navigation;
