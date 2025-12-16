
import Login from "../../pages/auth/Login"
import { useAuth } from "../Auth";

export const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return children;
};

export default PrivateRoute;