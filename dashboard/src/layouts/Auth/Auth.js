import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import * as Router from "router";
import routes from "router/auth.js";

import AuthNavbar from "components/Navbars/AuthNavbar.js";
import Footer from "components/Footer/Footer.js";



const Pages = (props) => {
  React.useEffect(() => {
    document.documentElement.classList.remove("nav-open");
  });


  return (
    <>
      <AuthNavbar brandText={Router.getActiveRoute(routes) + " Page"} />
      <div className="wrapper wrapper-full-page">
        <div className={"full-page " + Router.getFullPageName(routes)}>
          <Switch>
            {Router.getRoutes(routes)}
            <Redirect from="*" to="/auth/login" />
          </Switch>
          <Footer fluid />
        </div>
      </div>
    </>
  );
};

export default Pages;
