
import Login from "../../Pages/Login"
import { useAuth } from "../Auth";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return children;
};

export default PrivateRoute;