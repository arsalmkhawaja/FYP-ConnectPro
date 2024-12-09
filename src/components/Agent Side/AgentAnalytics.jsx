import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Line, Bar, Pie } from "react-chartjs-2";
import { toast } from "react-toastify";
import axios from "axios";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AgentAnalytics = () => {
  const navigate = useNavigate();
  const [callsData, setCallsData] = useState([]);
  const [lineChartData, setLineChartData] = useState(null);
  const [barChartData, setBarChartData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);
  const [horizontalBarChartData, setHorizontalBarChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const token = JSON.parse(localStorage.getItem("auth")) || "";

  useEffect(() => {
    if (!token) {
      toast.warn("Please login first to access the dashboard");
      navigate("/login");
      return;
    }

    const fetchCallData = async () => {
      try {
        const agentProfileResponse = await axios.get(
          "http://localhost:4000/api/v1/agent",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const agent = agentProfileResponse.data.agent;

        if (!agent || !agent._id) {
          throw new Error("Agent data not found");
        }

        const callsResponse = await axios.get(
          `http://localhost:4000/api/v5/agent/${agent._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const callLogs = callsResponse.data;
        setCallsData(callLogs);

        // Process data for charts
        setLineChartData(processLineChartData(callLogs));
        setBarChartData(processBarChartData(callLogs));
        setPieChartData(processPieChartData(callLogs));
        setHorizontalBarChartData(processHorizontalBarChartData(callLogs));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching call data:", error);
        toast.error("Failed to fetch call data");
        navigate("/login");
      }
    };

    fetchCallData();
  }, [token, navigate]);

  const processLineChartData = (data) => {
    const analyticsByDate = {};

    data.forEach((call) => {
      const callDate = new Date(call.date).toLocaleDateString();

      if (!analyticsByDate[callDate]) {
        analyticsByDate[callDate] = { total: 0, answered: 0 };
      }

      analyticsByDate[callDate].total += 1;

      if (call.disposition === "Answered") {
        analyticsByDate[callDate].answered += 1;
      }
    });

    const labels = [];
    const incomingCalls = [];
    const answeredCalls = [];

    Object.keys(analyticsByDate).forEach((date) => {
      labels.push(date);
      incomingCalls.push(analyticsByDate[date].total);
      answeredCalls.push(analyticsByDate[date].answered);
    });

    const blueAccent = colors?.blueAccent?.[500] || "#0000FF";
    const purpleAccent = colors?.purpleAccent?.[500] || "#800080";

    return {
      labels,
      datasets: [
        {
          label: "Incoming Calls",
          data: incomingCalls,
          borderColor: blueAccent,
          backgroundColor: `${blueAccent}1A`,
          tension: 0.4,
          fill: true,
        },
        {
          label: "Answered Calls",
          data: answeredCalls,
          borderColor: purpleAccent,
          backgroundColor: `${purpleAccent}1A`,
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };

  const processBarChartData = (data) => {
    const dispositionCounts = {};

    data.forEach((call) => {
      const disposition = call.disposition || "Unknown";

      if (!dispositionCounts[disposition]) {
        dispositionCounts[disposition] = 0;
      }

      dispositionCounts[disposition] += 1;
    });

    const labels = Object.keys(dispositionCounts);
    const counts = Object.values(dispositionCounts);

    const greenAccent = colors?.greenAccent?.[500] || "#00FF00";

    return {
      labels,
      datasets: [
        {
          label: "Call Dispositions",
          data: counts,
          backgroundColor: greenAccent,
        },
      ],
    };
  };

  const processPieChartData = (data) => {
    const dispositionCounts = {};

    data.forEach((call) => {
      const disposition = call.disposition || "Unknown";

      if (!dispositionCounts[disposition]) {
        dispositionCounts[disposition] = 0;
      }

      dispositionCounts[disposition] += 1;
    });

    const labels = Object.keys(dispositionCounts);
    const counts = Object.values(dispositionCounts);

    const colorsArray = labels.map(
      (_, index) => colors?.primary?.[index * 100 + 100] || `hsl(${index * 60}, 70%, 50%)`
    );

    return {
      labels,
      datasets: [
        {
          label: "Disposition Distribution",
          data: counts,
          backgroundColor: colorsArray,
        },
      ],
    };
  };

  const processHorizontalBarChartData = (data) => {
    let answeredDuration = 0;
    let missedCount = 0;
    let answeredCount = 0;

    data.forEach((call) => {
      if (call.disposition === "Answered") {
        answeredDuration += call.duration || 0;
        answeredCount += 1;
      } else {
        missedCount += 1;
      }
    });

    return {
      labels: ["Answered Calls", "Missed Calls"],
      datasets: [
        {
          label: "Average Duration (seconds)",
          data: [
            answeredDuration / (answeredCount || 1), // Avoid division by zero
            missedCount,
          ],
          backgroundColor: [colors?.blueAccent?.[500], colors?.redAccent?.[500]],
        },
      ],
    };
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Grid container spacing={3}>
      {/* Line Chart */}
      <Grid item xs={12} md={6}>
        <Box
          sx={{
            padding: "20px",
            borderRadius: "8px",
            backgroundColor: colors.primary[500],
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: "10px", color: colors.gray[100] }}>
            Incoming vs. Answered Calls Over Time
          </Typography>
          <Line data={lineChartData} options={{ responsive: true }} />
        </Box>
      </Grid>

      {/* Bar Chart */}
      <Grid item xs={12} md={6}>
        <Box
          sx={{
            padding: "20px",
            borderRadius: "8px",
            backgroundColor: colors.primary[500],
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: "10px", color: colors.gray[100] }}>
            Call Dispositions
          </Typography>
          <Bar data={barChartData} options={{ responsive: true }} />
        </Box>
      </Grid>

      {/* Pie Chart */}
      <Grid item xs={12} md={6}>
        <Box
          sx={{
            padding: "20px",
            borderRadius: "8px",
            backgroundColor: colors.primary[500],
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: "10px", color: colors.gray[100] }}>
            Disposition Distribution
          </Typography>
          <Pie data={pieChartData} options={{ responsive: true }} />
        </Box>
      </Grid>

      {/* Horizontal Bar Chart */}
      <Grid item xs={12} md={6}>
        <Box
          sx={{
            padding: "20px",
            borderRadius: "8px",
            backgroundColor: colors.primary[500],
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: "10px", color: colors.gray[100] }}>
            Average Call Duration
          </Typography>
          <Bar data={horizontalBarChartData} options={{ responsive: true, indexAxis: "y" }} />
        </Box>
      </Grid>
    </Grid>
  );
};

export default AgentAnalytics;
