import React, { useContext, useState, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="container">
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <h1 className="display-1 fw-bold">404</h1>
        <p className="fs-3">
          <span className="text-danger">Oops!</span> Page not found.
        </p>
        <p className="lead">
          The page you're looking for doesn't exist.
        </p>
        <a href="/" className="btn btn-primary">Go Home</a>
      </div>
    </div>
  </div>
);

/*
  const getElement = (route) => {
    if (route.layout) {
      const Component = route.layout;
      return <Component {...route} />;
    } else {
      return route.element;
    }
  }

const Router = ({ routes }) => {

  const generateRoutesTree = (route, parentKey) => {
    // If the route has nested routes, first create a component <Route> for the parent route
    if (route.routes) {
      return (
        React.createElement(Route, { key: parentKey, path: route.path, element: getElement(route) },
          route.routes.map((childRoute, childIndex) => generateRoutesTree(childRoute, childIndex))
        )
      );
    } else {
      const routes = [React.createElement(Route, { key: parentKey, path: route.path, element: getElement(route) })];

      if (route.isIndex) {
        // For index routes, ensure they are rendered at the parent path
        routes.unshift(React.createElement(Route, { key: `${parentKey}-index`, index: true, element: route.element }));
        // Add a catch-all not-found route specific to this nested route's context
        routes.push(React.createElement(Route, { key: `${parentKey}-notfound`, path: "*", element: React.createElement(NotFoundPage) }));
      }

      return React.createElement(React.Fragment, null, routes);
    }
  }

  return (
    <Routes>
      {routes.map((route, index) => generateRoutesTree(route, index))}
      <Route key={'not-found'} path={'*'} element={<NotFoundPage />} />
    </Routes>
  );


export const getRoutes = (routes) => {
  const subclass = 'side-subnav';

  return routes.map((prop, key) => {
    if (prop.collapse) {
      return getRoutes(prop.views);
    }
    if (prop.layout) {
      return (
        <Route
          path={prop.layout + prop.path}
          element={prop.component}
          key={key}
          className={prop.collapse ? subclass : "side-nav"}
        />
      );
    } else {
      return null;
    }
  });
};

export const Router = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState('/');

  const navigate = (path) => {
    setCurrentRoute(path);
  };

  return (
    <RouterContext.Provider value={{ currentRoute, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) throw new Error('useRouter must be used within Router');
  return context;
};

export default Router;};
*/