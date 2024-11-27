import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import UserContext from "../context/UserContext";

const PrivateRoute = () => {
  const { authUser } = useContext(UserContext);
  const location = useLocation(); // Get location

  return authUser ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" state={{ from: location }} />
  );
};

export default PrivateRoute;
