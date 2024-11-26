import { useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "../context/UserContext";

const PrivateRoute = ({ children }) => {
  const { authUser } = useContext(UserContext);

  return authUser ? children : <Navigate to="/signin" />;
};

export default PrivateRoute;
