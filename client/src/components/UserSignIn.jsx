import { useContext, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import UserContext from "../context/UserContext";

const UserSignIn = () => {
  const { actions } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  // State
  const username = useRef(null);
  const password = useRef(null);
  const [errors, setErrors] = useState([]);

  // Event Handlers
  const handleSubmit = async (event) => {
    event.preventDefault();

    const from = location.state?.from || "/";

    const credentials = {
      emailAddress: username.current.value, 
      password: password.current.value,
    };

    try {
      const user = await actions.signIn(credentials);
      if (user) {
        navigate(from);
      } else {
        setErrors(["Sign-in was unsuccessful"]);
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        navigate("/error"); //server error
      } else {
        navigate("/error"); // Catch unexpected errors
      }
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();
    navigate("/");
  };

  return (
    <div className="form--centered">
      <h2>Sign In</h2>
      {errors.length > 0 && (
        <div className="validation--errors">
          <h3>Validation Errors</h3>
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <label htmlFor="emailAddress">Email Address</label>
        <input
          id="emailAddress"
          name="emailAddress"
          type="email"
          ref={username}
          placeholder="Email Address"
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          ref={password}
          placeholder="Password"
        />
        <div className="pad-bottom">
          {/* <button className="button" type="submit" style={{ background: accentColor }}>Sign in</button> */}
          <button className="button" type="submit">
            Sign in
          </button>
          <button className="button button-secondary" onClick={handleCancel}>
            Cancel
          </button>
          {/* <button className="button button-secondary" style={{ color: accentColor }} onClick={handleCancel}>Cancel</button> */}
        </div>
      </form>
      <p>
        Don't have a user account? <Link to="/signup">Click here</Link> to sign
        up!
        {/* Don't have a user account? <Link style={{ color: accentColor }} to="/signup">Click here</Link> to sign up! */}
      </p>
    </div>
  );
};

export default UserSignIn;
