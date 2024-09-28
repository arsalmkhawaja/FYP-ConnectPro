import React from "react";
import { Line } from "react-chartjs-2";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme"; // Adjust path if necessary
import data from "./data.json"; // Directly importing the data

// Register the components for Chart.js
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
  const theme = useTheme();
  const colors = tokens(theme.palette.mode) || {}; // Ensure colors is defined
  const blueAccent = colors.blueAccent ? colors.blueAccent[500] : "#0000FF"; // Fallback to blue
  const purpleAccent = colors.purpleAccent
    ? colors.purpleAccent[500]
    : "#800080"; // Fallback to purple
  const primary = colors.primary ? colors.primary[500] : "#333333"; // Fallback to a dark color
  const gray = colors.gray ? colors.gray[100] : "#FFFFFF"; // Fallback to white

  // Add a check to ensure data is defined
  if (!data || !data.agents) {
    return <div>No data available.</div>;
  }

  // Find the agent's data
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
        backgroundColor: `${blueAccent}1A`, // Adjust opacity for the background
        tension: 0.4,
        fill: true,
      },
      {
        label: "Answered Calls",
        data: agentData.callsVolume.answeredCalls,
        borderColor: purpleAccent,
        backgroundColor: `${purpleAccent}1A`, // Adjust opacity for the background
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

export default AgentAnalytics
;
