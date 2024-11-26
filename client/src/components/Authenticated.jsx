import { useContext } from "react";
import UserContext from "../context/UserContext";
import { Link } from "react-router-dom";

const Authenticated = () => {
  const { authUser } = useContext(UserContext);
  //if user isn't signed up...how do they get here? --Add link to signin page
  if (!authUser) {
    return (
      <div className="bounds">
        <div className="grid-100">
          <h1>User not authenticated</h1>
          <p>Please <Link to="/signin">sign in</Link> to view this page.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="bounds">
      <div className="grid-100">
        <h1>{authUser.firstName} {authUser.lastName} is Authenticated</h1>
        <p>Your username is {authUser.emailAddress}</p>
      </div>
    </div>
  );
}

export default Authenticated;