import React, { useEffect, useState } from "react";
import Logo from "../assets/logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ErrorModal = ({ show, message, onClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay" role="alertdialog">
      <div className="modal-content">
        <h2>Error</h2>
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isRoleAdmin, setIsRoleAdmin] = useState(true);
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("auth")) || ""
  );
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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

        if (role === "agent") {
          const agentInfo = {
            agentID: response.data.agentID || "",
            fullName: response.data.fullName || "",
          };
          console.log("Agent Info to be stored:", agentInfo);
          localStorage.setItem("agentInfo", JSON.stringify(agentInfo));
        }

        toast.success("Login successful");

        if (role === "admin") {
          navigate("/dashboard");
        } else if (role === "agent") {
          navigate("/agent");
        }
      } catch (err) {
        if (err.response) {
          setErrorMessage(err.response.data.msg || "Wrong email or password");
          setShowErrorModal(true);
        } else if (err.request) {
          setErrorMessage("No response from server");
          setShowErrorModal(true);
        } else {
          setErrorMessage("An error occurred");
          setShowErrorModal(true);
        }
      }
    } else {
      toast.error("Please fill in all fields");
    }
  };

  useEffect(() => {
    if (token) {
      toast.success("You are already logged in");
      navigate("/login");
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

          <div className="role-toggle">
            <label className="switch">
              <input
                type="checkbox"
                checked={!isRoleAdmin}
                onChange={() => setIsRoleAdmin(!isRoleAdmin)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>
      <ErrorModal
        show={showErrorModal}
        message={errorMessage}
        onClose={() => setShowErrorModal(false)}
      />
    </div>
  );
};

export default Login;
