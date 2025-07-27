import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { store } from "../features/store";

export const PrivateRoutes = ({ children }) => {
  //const userState = useSelector( state => state.user.data )
  const localData = store.local.has("auth") ? store.local.get("auth") : undefined;
  
  return (localData.user && localData.token !== undefined) ? (
    children
  ) : (
    <Navigate to="/login" replace={true} />
  );
};
