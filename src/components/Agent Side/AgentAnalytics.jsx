import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { toast } from "react-toastify";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import data from "./data.json";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AgentAnalytics = ({ loggedInAgent }) => {
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("auth")) || "";
  useEffect(() => {
    if (!token) {
      toast.warn("Please login first to access the dashboard");
      navigate("/login");
    }
  }, [token, navigate]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode) || {};
  const blueAccent = colors.blueAccent ? colors.blueAccent[500] : "#0000FF";
  const purpleAccent = colors.purpleAccent
    ? colors.purpleAccent[500]
    : "#800080";
  const primary = colors.primary ? colors.primary[500] : "#333333";
  const gray = colors.gray ? colors.gray[100] : "#FFFFFF";

  if (!data || !data.agents) {
    return <div>No data available.</div>;
  }

  const agentData = data.agents.find((agent) => agent.name === loggedInAgent);

  if (!agentData) {
    return <div>No data available for this agent.</div>;
  }

  const chartData = {
    labels: agentData.callsVolume.labels,
    datasets: [
      {
        label: "Incoming Calls",
        data: agentData.callsVolume.incomingCalls,
        borderColor: blueAccent,
        backgroundColor: `${blueAccent}1A`,
        tension: 0.4,
        fill: true,
      },
      {
        label: "Answered Calls",
        data: agentData.callsVolume.answeredCalls,
        borderColor: purpleAccent,
        backgroundColor: `${purpleAccent}1A`,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          usePointStyle: true,
        },
      },
    },
  };

  return (
    <Box
      className="chart-container small-chart"
      sx={{
        marginBottom: "20px",
        padding: "20px",
        borderRadius: "8px",
        backgroundColor: primary,
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: "10px", color: gray }}>
        Overall Calls Volume
      </Typography>
      <Line data={chartData} options={chartOptions} />
    </Box>
  );
};

export default AgentAnalytics;
