import { createContext, useState } from "react";
import Cookies from "js-cookie";
import { api } from "../utils/apiHelper";

const UserContext = createContext(null); //store data

export const UserProvider = ({ children }) => {
  const cookie = Cookies.get("authenticatedUser");
  const [authUser, setAuthUser] = useState(cookie ? JSON.parse(cookie) : null); //logged in?

  const signIn = async (credentials) => {
    const response = await api("/users", "GET", null, credentials);
    if (response.status === 200) {
      const user = await response.json();
      setAuthUser(user);
      Cookies.set(
        "authenticatedUser",
        JSON.stringify({ ...user, password: credentials.password }),
        { expires: 1 },
      );
      return { ...user, password: credentials.password };
    } else if (response.status === 401) {
      return null;
    } else {
      throw new Error();
    }
  };

  const signOut = () => {
    setAuthUser(null);
    Cookies.remove("authenticatedUser");
  };

  return (
    <UserContext.Provider
      value={{
        authUser,
        actions: {
          signIn,
          signOut,
        },
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
