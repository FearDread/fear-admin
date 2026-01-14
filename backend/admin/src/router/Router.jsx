import React, { useState, createContext, useContext } from 'react';
import { Route } from "react-router-dom";
export const RouterContext = createContext(null);

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

export default Router;