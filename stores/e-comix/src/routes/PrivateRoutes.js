import { Navigate } from "react-router-dom";
import cache from "../features/cache";

export const PrivateRoutes = ({ children }) => {
  //const getTokenFromLocalStorage = JSON.parse(localStorage.getItem("auth"));
  const isAuthorized = cache.local.has("auth") ? cache.local.get("auth") : undefined;
  
  return isAuthorized !== undefined ? (
    children
  ) : (
    <Navigate to="/login" replace={true} />
  );
};
