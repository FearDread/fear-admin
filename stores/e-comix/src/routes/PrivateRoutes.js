import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { store } from "../features/store";

export const PrivateRoutes = ({ children }) => {
  const userState = useSelector( state => state.user.data )
  //const user = store.local.has("auth") ? store.local.get("auth") : undefined;
  console.log('user = ', userState);
  return (userState.user && userState.token !== undefined) ? (
    children
  ) : (
    <Navigate to="/login" replace={true} />
  );
};
