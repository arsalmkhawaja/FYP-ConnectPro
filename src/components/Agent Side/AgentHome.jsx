import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./styles/Layout.css";
import data from "./data.json";
import {
  FaPhone,
  FaCheckCircle,
  FaTimesCircle,
  FaPhoneAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

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

const AgentHome = ({ loggedInAgent }) => {
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

  const topAgents = data.agents
    .sort((a, b) => b.callMetrics.answeredCalls - a.callMetrics.answeredCalls)
    .slice(0, 5);

  return (
    <Box
      className="dashboard"
      sx={{
        backgroundColor: primary,
        color: gray,
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <Box
        className="metrics-container"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <Box
          className="metric-card incoming"
          sx={{
            backgroundColor: primary,
            borderRadius: "8px",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <FaPhone className="metric-icon" style={{ color: blueAccent }} />
          <Typography variant="h6">Incoming Calls</Typography>
          <Typography variant="h4" fontWeight="bold">
            {agentData.callMetrics.incomingCalls}
          </Typography>
        </Box>
        <Box
          className="metric-card answered"
          sx={{
            backgroundColor: primary,
            borderRadius: "8px",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <FaCheckCircle
            className="metric-icon"
            style={{ color: blueAccent }}
          />
          <Typography variant="h6">Answered Calls</Typography>
          <Typography variant="h4" fontWeight="bold">
            {agentData.callMetrics.answeredCalls}
          </Typography>
        </Box>
        <Box
          className="metric-card abandoned"
          sx={{
            backgroundColor: primary,
            borderRadius: "8px",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <FaTimesCircle
            className="metric-icon"
            style={{ color: blueAccent }}
          />
          <Typography variant="h6">Abandoned Calls</Typography>
          <Typography variant="h4" fontWeight="bold">
            {agentData.callMetrics.abandonedCalls}
          </Typography>
        </Box>
        <Box
          className="metric-card total"
          sx={{
            backgroundColor: primary,
            borderRadius: "8px",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <FaPhoneAlt className="metric-icon" style={{ color: blueAccent }} />
          <Typography variant="h6">Total Calls</Typography>
          <Typography variant="h4" fontWeight="bold">
            {agentData.callMetrics.totalCalls}
          </Typography>
        </Box>
      </Box>

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

      <Box
        className="additional-sections"
        sx={{ display: "flex", gap: "20px" }}
      >
        <Box
          className="agents-section"
          sx={{
            flex: 1,
            padding: "20px",
            borderRadius: "8px",
            backgroundColor: primary,
          }}
        >
          <Typography variant="h5" sx={{ marginBottom: "10px", color: gray }}>
            Best Agents This Week
          </Typography>
          <table>
            <thead
              style={{
                color:
                  theme.palette.mode === "dark" ? primary : colors.primary[100],
              }}
            >
              <tr>
                <th
                  style={{
                    backgroundColor:
                      theme.palette.mode != "dark"
                        ? primary
                        : colors.primary[100],
                    borderTopLeftRadius: "8px",
                    borderBottomLeftRadius: "8px",
                  }}
                >
                  Agent
                </th>
                <th
                  style={{
                    backgroundColor:
                      theme.palette.mode != "dark"
                        ? primary
                        : colors.primary[100],
                  }}
                >
                  Answered
                </th>
                <th
                  style={{
                    backgroundColor:
                      theme.palette.mode != "dark"
                        ? primary
                        : colors.primary[100],
                  }}
                >
                  Abandoned
                </th>
                <th
                  style={{
                    backgroundColor:
                      theme.palette.mode != "dark"
                        ? primary
                        : colors.primary[100],
                    borderTopRightRadius: "8px",
                    borderBottomRightRadius: "8px",
                  }}
                >
                  Cust. Satisfaction
                </th>
              </tr>
            </thead>
            <tbody>
              {topAgents.map((agent) => (
                <tr key={agent.name} style={{ color: gray }}>
                  <td
                    style={{
                      color:
                        theme.palette.mode != "dark"
                          ? colors.gray[1000]
                          : colors.primary[100],
                    }}
                  >
                    {agent.name}
                  </td>
                  <td
                    style={{
                      color:
                        theme.palette.mode != "dark"
                          ? colors.gray[1000]
                          : colors.primary[100],
                    }}
                  >
                    {agent.callMetrics.answeredCalls}
                  </td>
                  <td
                    style={{
                      color:
                        theme.palette.mode != "dark"
                          ? colors.gray[1000]
                          : colors.primary[100],
                    }}
                  >
                    {agent.callMetrics.abandonedCalls}
                  </td>
                  <td
                    style={{
                      color:
                        theme.palette.mode != "dark"
                          ? colors.gray[1000]
                          : colors.primary[100],
                    }}
                  >
                    {agent.satisfaction}/5
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
        <Box
          className="calendar-section"
          sx={{
            flex: 1,
            padding: "20px",
            borderRadius: "8px",
            backgroundColor: primary,
          }}
        >
          <Typography variant="h5" sx={{ marginBottom: "10px", color: gray }}>
            Calendar
          </Typography>
          <Calendar />
        </Box>
      </Box>
    </Box>
  );
};

export default AgentHome;
