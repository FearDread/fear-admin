import { Navigate } from "react-router-dom";
import { store } from "../features/store";

export const PrivateRoutes = ({ children }) => {
  const user = store.local.has("auth") ? store.local.get("auth") : undefined;

  return (user && user.token !== undefined) ? (
    children
  ) : (
    <Navigate to="/login" replace={true} />
  );
};
