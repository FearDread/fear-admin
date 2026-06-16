'use client';

import { useState, createContext, useContext } from 'react';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email, password) => {
    // TODO: swap with real API call
    // const res = await fetch('/fear/api/auth/login', {
    //   method: 'POST',
    //   body: JSON.stringify({ email, password }),
    //   headers: { 'Content-Type': 'application/json' },
    // });
    // const data = await res.json();
    // setUser(data.user);
    setUser({ email, name: 'John Doe' });
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const login = async (email, password) => {
  const res = await fetch('/fear/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  // middleware.js reads this cookie to protect routes
  document.cookie = `auth_token=${data.token}; path=/; secure; samesite=strict`;
  setUser(data.user);
  setIsAuthenticated(true);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthProvider;