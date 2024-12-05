import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Chart from "chart.js/auto"; // Import Chart.js

const AgentAnalyticsDashboard = () => {
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("auth")) || "";

  // Check if the user is logged in
  useEffect(() => {
    if (!token) {
      toast.warn("Please login first to access the dashboard");
      navigate("/login");
    }
  }, [token, navigate]);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // States for the component
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [selectedChartType, setSelectedChartType] = useState("bar");
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [comparisonData, setComparisonData] = useState({
    labels: [],
    datasets: [],
  });
  const [totalCalls, setTotalCalls] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [successRate, setSuccessRate] = useState(0);
  const [targetAchievement, setTargetAchievement] = useState(0);
  const [agentsPerformance, setAgentsPerformance] = useState([]); // Agents performance data
  const [campaigns, setCampaigns] = useState([]); // Add state for campaigns

  // Fetch campaigns for selection
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/v2/campaigns", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data.data;
        setCampaigns(data); // Store campaigns in state

        // Default to the _id of the first campaign if available
        setSelectedCampaign(data[0]?._id || ""); // Use _id for selectedCampaign
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        toast.error("Failed to fetch campaigns");
      }
    };
    fetchCampaigns();
  }, [token]);

  // Fetch analytics data based on selected campaign
  useEffect(() => {
    if (!selectedCampaign) return;

    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/v6/analytics/campaign/${selectedCampaign}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched analytics data:", data);

        const { totalCalls, totalDuration, totalSales, successRate, targetAchievement, agentsPerformance } = data;
        
        // Set state values
        setTotalCalls(totalCalls);
        setTotalDuration(totalDuration);
        setTotalSales(totalSales);
        setSuccessRate(successRate); // Already pre-calculated or sent from the backend
        setTargetAchievement(targetAchievement); // Pre-calculated or sent from backend
        setAgentsPerformance(agentsPerformance);

        // Calculate average call duration
        const avgCallDuration = totalCalls > 0 ? totalDuration / totalCalls : 0;

        // Prepare chart data for agents performance
        const agentNames = agentsPerformance.map(agent => agent.agentName);
        const agentPerformances = agentsPerformance.map(agent => agent.performance);

        const newChartData = {
          labels: agentNames,
          datasets: [
            {
              label: "Agent Performance (%)",
              data: agentPerformances,
              backgroundColor: selectedChartType === "bar" ? "rgba(75, 192, 192, 0.2)" : "rgba(54, 162, 235, 0.2)",
              borderColor: selectedChartType === "bar" ? "rgba(75, 192, 192, 1)" : "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        };

        setChartData(newChartData);

        // Update other stats in the UI (like success rate, target achievement, etc.)
      } catch (error) {
        console.error("Error fetching analytics:", error);
        toast.error("Failed to fetch analytics data");
      }
    };

    fetchAnalytics();
  }, [selectedCampaign, selectedChartType]);

  // Initialize charts once chartData or comparisonData is updated
  useEffect(() => {
    if (chartData.labels.length && chartData.datasets.length) {
      const ctx = document.getElementById("agentChartCanvas");
      new Chart(ctx, {
        type: selectedChartType, // "bar" or "line"
        data: chartData,
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }, [chartData, selectedChartType]);

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        color: colors.primary[400],
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        width: "100%",
        padding: "20px",
        paddingTop: "80px",
      }}
    >
      <div
        style={{
          backgroundColor: colors.primary[400],
          padding: "20px",
          width: "120%",
          maxWidth: "1200px",
          margin: "0 auto",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
        }}
      >
        <h1
          style={{
            marginBottom: "20px",
            fontSize: "2.5em",
            color: "#0e2b4e",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
          }}
        >
          Campaign Analytics Dashboard
        </h1>

        {/* Dropdown to select campaign */}
        <div>
          <select
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
            style={{
              padding: "10px",
              margin: "10px",
              fontSize: "1.2em",
              border: "2px solid #4e87c4",
              borderRadius: "5px",
              backgroundColor: "#fff",
              color: "#0e2b4e",
              outline: "none",
              transition: "all 0.3s ease",
            }}
          >
            <option value="">Select a campaign</option>
            {/* Dynamically render campaigns with a unique key */}
            {campaigns.map((campaign) => (
              <option key={campaign._id} value={campaign._id}>
                {" "}
                {campaign.name}
              </option>
            ))}
          </select>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "20px",
            color: "white",
          }}
        >
          <p>Total Number of Calls: {totalCalls}</p>
          <p>Total Duration: {totalDuration} seconds</p>
          <p>Success Rate: {successRate}%</p>
          <p>Target Achievement: {targetAchievement}%</p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            width: "100%",
            marginTop: "20px",
          }}
        >
          <canvas
            id="agentChartCanvas"
            style={{
              maxWidth: "45%",
              maxHeight: "70vh",
              border: "2px solid #4e87c4",
              borderRadius: "10px",
              backgroundColor: "#fff",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          ></canvas>
        </div>
      </div>
    </div>
  );
};

export default AgentAnalyticsDashboard;
