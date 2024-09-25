import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Dashboard.css";
import { toast } from "react-toastify";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("auth")) || "";
  useEffect(() => {
    // Check if token exists and redirect if not
    if (!token) {
      toast.warn("Please login first to access the dashboard");
      navigate("/login");
    }
  }, [token, navigate]);

  const handleLogout = () => {
    try {
      // Remove the authentication token from localStorage
      localStorage.removeItem("auth");
      console.log("Token removed from localStorage");

      // Redirect the user to the login page
      navigate("/login");
      toast.info("Logged out successfully.");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <div className="dashboard-main">
      <h1>Welcome to Your Dashboard</h1>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
