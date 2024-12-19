import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import './SignIn.css';
import logo from "../Assets/logo.png";

const SignIn = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ identifier: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({ identifier: "", password: "" });

    try {
      const response = await axios.post("http://localhost:8000/api/signin", { identifier, password });
      const { user, token } = response.data;
      localStorage.setItem("token", token);
      if (user.role === "admin") {
        console.log(user.role)
        navigate("/admin");
      } else if (user.role === "user") {
        navigate("/user");
      }
    } catch (err) {
      if (err.response?.data?.msg === "Incorrect password") {
        setError((prevError) => ({ ...prevError, password: "Incorrect password" }));
      } else if (err.response?.data?.msg === "User not registered") {
        setError((prevError) => ({ ...prevError, identifier: "Identifier does not exist" }));
      }
    }
  };

  return (
    <div className="signin-container">
      <div className="sign-container">
        <img src={logo} alt="Logo" className="Logo" />
        <div className="sign-wrapper">
          <form className="form-sign" onSubmit={handleSubmit}>
            <div className="sign-div">
              <label  className='label' htmlFor="identifier">Username or Email</label>
              <input
                className="sign-input"
                type="text"
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                style={{ border: error.identifier ? "2px solid red" : undefined }}
              />
              {error.identifier && <span>{error.identifier}</span>}
              </div>
              <div className="sign-div">
              <label className='label' htmlFor="password">Password</label>
              <input
                className="sign-input"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ border: error.password ? "2px solid red" : undefined }}
              />
              {error.password && <span>{error.password}</span>}
              </div>

            <button type="submit" className="Submit">Log In</button>
            <h5>
              Don’t have an account? 
              <Link to="/signup" className="create-account-link">
                Create an account
              </Link>
            </h5>
          </form>
        </div>
      </div>
      <div className="photo"></div>
    </div>
  );
};

export default SignIn;
