import { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../utils/apiHelper";

import UserContext from "../context/UserContext";

const UserSignUp = () => {
  const { actions } = useContext(UserContext);
  const navigate = useNavigate();

  // State
  const firstName = useRef(null);
  const lastName = useRef(null);
  const emailAddress = useRef(null);
  const password = useRef(null);
  const [errors, setErrors] = useState([]);

  // event handlers
  const handleSubmit = async (event) => {
    event.preventDefault();

    const user = {
      firstName: firstName.current.value,
      lastName: lastName.current.value,
      emailAddress: emailAddress.current.value,
      password: password.current.value,
    };

    try {
      const response = await api("/users", "POST", user);
      if (response.status === 201) {
        console.log(`Succesfully signed up and autheniticated`);
        const signedInUser = await actions.signIn(user);

      if (signedInUser) {
        console.log("User successfully signed in:", signedInUser);
        navigate("/"); 
      } else {
        setErrors(["Sign-in failed after account created."]);
      }
      } else if (response.status === 400) {
        const data = await response.json();
        setErrors(data.errors);
      } else {
        throw new Error("Failed Sign-In");
      }
    } catch (error) {
      console.log(error);
      navigate("/error"); // Navigate to error route
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();
    navigate("/");
  };

  return (
    <div className="form--centered">
      <h2>Sign Up</h2>
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
        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          ref={firstName}
          placeholder="First Name"
        />
        <label htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          ref={lastName}
          placeholder="Last Name"
        />
        <label htmlFor="emailAddress">Email Address</label>
        <input
          id="emailAddress"
          name="emailAddress"
          type="email"
          ref={emailAddress}
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
        <button className="button" type="submit">
          Sign Up
        </button>
        <button className="button button-secondary" onClick={handleCancel}>
          Cancel
        </button>
      </form>
      <p>
        Already have a user account? <Link to="/signin">Click here</Link> to
        sign in!
      </p>
    </div>
  );
};

export default UserSignUp;
