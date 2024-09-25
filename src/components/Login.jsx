import React, { useEffect, useState } from "react";
import Logo from "../assets/logo.png";
import GoogleSvg from "../assets/icons8-google.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isRoleAdmin, setIsRoleAdmin] = useState(true);
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("auth")) || ""
  );
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const role = isRoleAdmin ? "admin" : "agent";

    if (email && password && role) {
      const formData = { email, password, role };
      try {
        const response = await axios.post(
          "http://localhost:4000/api/v1/login",
          formData
        );
        localStorage.setItem("auth", JSON.stringify(response.data.token));
        toast.success("Login successful");

        if (role === "admin") {
          navigate("/dashboard");
        } else if (role === "agent") {
          navigate("/dialer");
        }
      } catch (err) {
        if (err.response) {
          toast.error(err.response.data.msg || "Login failed");
        } else if (err.request) {
          toast.error("No response from server");
        } else {
          toast.error("An error occurred");
        }
      }
    } else {
      toast.error("Please fill in all fields");
    }
  };

  useEffect(() => {
    if (token) {
      toast.success("You are already logged in");
      navigate("/dashboard");
    }
  }, [token, navigate]);

  return (
    <div className="login-main">
      <div className="login-left"></div>
      <div className={`login-right ${isRoleAdmin ? "admin" : "agent"}`}>
        <div className="login-right-container">
          <div className="login-logo">
            <img src={Logo} alt="Logo" />
          </div>
          {/* Conditionally render content based on role */}
          {isRoleAdmin ? (
            <div className="login-center">
              <h2>Welcome back, Admin!</h2>
              <p>Please enter your details</p>
              <form onSubmit={handleLoginSubmit}>
                <input type="email" placeholder="Email" name="email" required />
                <div className="pass-input-div">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    name="password"
                    required
                  />
                  {showPassword ? (
                    <FaEyeSlash
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ cursor: "pointer" }}
                    />
                  ) : (
                    <FaEye
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ cursor: "pointer" }}
                    />
                  )}
                </div>
                <div className="login-center-buttons">
                  <button type="submit">Log In as Admin</button>
                </div>
              </form>
            </div>
          ) : (
            <div className="login-center">
              <h2>Welcome back, Agent!</h2>
              <p>Please enter your details</p>
              <form onSubmit={handleLoginSubmit}>
                <input type="email" placeholder="Email" name="email" required />
                <div className="pass-input-div">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    name="password"
                    required
                  />
                  {showPassword ? (
                    <FaEyeSlash
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ cursor: "pointer" }}
                    />
                  ) : (
                    <FaEye
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ cursor: "pointer" }}
                    />
                  )}
                </div>

                <div className="login-center-buttons">
                  <button type="submit">Log In as Agent</button>
                </div>
              </form>
            </div>
          )}

          {/* Role toggle switch */}
          <div class="role-toggle">
            <label class="switch">
              <input
                type="checkbox"
                checked={!isRoleAdmin}
                onChange={() => setIsRoleAdmin(!isRoleAdmin)}
              />
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
