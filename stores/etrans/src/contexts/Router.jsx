import React, { useState, createContext, useContext } from 'react';

export const RouterContext = createContext(null);

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