import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectIsAuthenticated } from "../features/user/slice";

export const AuthRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return children;

  }


};

export default AuthRoute;