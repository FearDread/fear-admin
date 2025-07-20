import { Navigate } from "react-router-dom";
import cache from "../features/factory/cache.js";

export const PrivateRoutes = ({ children }) => {
  //const getTokenFromLocalStorage = JSON.parse(localStorage.getItem("auth"));
  const user = cache.local.has("auth") ? cache.local.get("auth") : undefined;

  return (user && user.token !== undefined) ? (
    children
  ) : (
    <Navigate to="/login" replace={true} />
  );
};
