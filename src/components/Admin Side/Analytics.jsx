import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Line, Bar, Pie } from "react-chartjs-2";
import { toast } from "react-toastify";
import axios from "axios";
import {
  Box,
  Grid,
  Typography,
  useTheme,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
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

const AgentAnalyticsWithDropdown = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]); // Ensure it's an array
  const [selectedAgent, setSelectedAgent] = useState("");
  const [selectedChart, setSelectedChart] = useState("Line");
  const [agentData, setAgentData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const token = JSON.parse(localStorage.getItem("auth"));

  useEffect(() => {
    if (!token) {
      toast.warn("Please login first to access the dashboard");
      navigate("/login");
    }
  }, [token, navigate]);

  // Fetch all agents for the dropdown
  const fetchAgents = async () => {
    try {
      if (!token) {
        throw new Error("No token available");
      }
  
      const response = await axios.get("http://localhost:4000/api/v1/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("Fetched agents response:", response); // Log the response for inspection
  
      // Check if the response data is an object containing an array of agents
      if (Array.isArray(response.data)) {
        setAgents(response.data);
      } else if (response.data && Array.isArray(response.data.agents)) {
        setAgents(response.data.agents); // Adjust if the agents are inside a nested object
      } else {
        console.error("Expected array of agents, but received:", response.data);
        toast.error("Failed to fetch agents: Invalid data structure");
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
      toast.error("Failed to fetch agents");
    }
  };
  

  useEffect(() => {
    fetchAgents();
  }, [token]);

  // Fetch agent-specific data when an agent is selected
  useEffect(() => {
    if (selectedAgent) {
      const fetchAgentData = async () => {
        try {
          setLoading(true); // Start loading when agent is selected
          const response = await axios.get(
            `http://localhost:4000/api/v1/analytics/agent/${selectedAgent}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          console.log("Fetched agent data:", response.data); // Debugging
          setAgentData(response.data);
          setLoading(false); // Stop loading when data is fetched
        } catch (error) {
          console.error("Error fetching data for the selected agent:", error);
          toast.error("Failed to fetch agent data");
          setLoading(false); // Stop loading on error as well
        }
      };

      fetchAgentData();
    }
  }, [selectedAgent, token]);

  // Process chart data based on the selected chart type
  useEffect(() => {
    if (agentData.length) {
      console.log("Processing chart data..."); // Debugging
      switch (selectedChart) {
        case "Line":
          setChartData(processLineChartData(agentData));
          break;
        case "Bar":
          setChartData(processBarChartData(agentData));
          break;
        case "Pie":
          setChartData(processPieChartData(agentData));
          break;
        default:
          break;
      }
    }
  }, [agentData, selectedChart]);

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

    return {
      labels,
      datasets: [
        {
          label: "Incoming Calls",
          data: incomingCalls,
          borderColor: "#1f77b4",
          backgroundColor: "rgba(31, 119, 180, 0.2)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Answered Calls",
          data: answeredCalls,
          borderColor: "#2ca02c",
          backgroundColor: "rgba(44, 160, 44, 0.2)",
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

    return {
      labels,
      datasets: [
        {
          label: "Call Dispositions",
          data: counts,
          backgroundColor: ["#ff7f0e", "#1f77b4", "#2ca02c", "#d62728"],
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

    return {
      labels,
      datasets: [
        {
          label: "Disposition Distribution",
          data: counts,
          backgroundColor: [
            "#1f77b4",
            "#ff7f0e",
            "#2ca02c",
            "#d62728",
            "#9467bd",
          ],
        },
      ],
    };
  };

  return (
    <Box sx={{ padding: "5px" }}>
      <Box
        sx={{
          padding: "10px",
          marginBottom: "20px",
          backgroundColor: colors.primary[500],
          borderRadius: "8px",
        }}
      >
        <Typography
          variant="h3"
          sx={{ color: colors.gray[100], fontWeight: "bold" }}
        >
          Agent Analytics
        </Typography>
        <FormControl sx={{ minWidth: 200, marginTop: 2, marginRight: 2 }}>
          <InputLabel id="agent-select-label">Select Agent</InputLabel>
          <Select
            labelId="agent-select-label"
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
          >
            {Array.isArray(agents) && agents.length > 0 ? (
              agents.map((agent) => (
                <MenuItem key={agent.id} value={agent.id}>
                  {agent.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No agents found</MenuItem>
            )}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 200, marginTop: 2 }}>
          <InputLabel id="chart-type-select-label">Select Chart</InputLabel>
          <Select
            labelId="chart-type-select-label"
            value={selectedChart}
            onChange={(e) => setSelectedChart(e.target.value)}
          >
            <MenuItem value="Line">Line</MenuItem>
            <MenuItem value="Bar">Bar</MenuItem>
            <MenuItem value="Pie">Pie</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Box
            sx={{
              padding: "25px",
              borderRadius: "8px",
              backgroundColor: colors.primary[500],
            }}
          >
            {chartData && selectedChart === "Line" && (
              <Line data={chartData} options={{ responsive: true }} />
            )}
            {chartData && selectedChart === "Bar" && (
              <Bar data={chartData} options={{ responsive: true }} />
            )}
            {chartData && selectedChart === "Pie" && (
              <Pie data={chartData} options={{ responsive: true }} />
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AgentAnalyticsWithDropdown;
