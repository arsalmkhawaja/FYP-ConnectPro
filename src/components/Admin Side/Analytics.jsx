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
  Checkbox,
  ListItemText,
  OutlinedInput,
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

// Register Chart.js components
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

// Constants for menu properties
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 6 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const AgentAnalyticsWithDropdown = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [selectedCharts, setSelectedCharts] = useState([]);
  const [agentsData, setAgentsData] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const token = JSON.parse(localStorage.getItem("auth"));
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };
  useEffect(() => {
    if (!token) {
      toast.warn("Please login first to access the dashboard");
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    fetchAgents();
  }, [token]);

  const fetchAgents = async () => {
    try {
      if (!token) {
        throw new Error("No token available");
      }

      const response = await axios.get("http://localhost:4000/api/v1/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(response.data)) {
        setAgents(response.data);
      } else if (response.data && Array.isArray(response.data.agents)) {
        setAgents(response.data.agents);
      } else {
        toast.error("Failed to fetch agents: Invalid data structure");
      }
    } catch (error) {
      toast.error("Failed to fetch agents");
    }
  };

  const fetchAgentData = async (agentId) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/v5/agent/${agentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      toast.error(`Failed to fetch data for agent ID: ${agentId}`);
      return null;
    }
  };

  useEffect(() => {
    const fetchAllSelectedAgentsData = async () => {
      if (selectedAgents.length === 0) {
        setAgentsData({});
        return;
      }

      setLoading(true);
      const dataPromises = selectedAgents.map((agentId) =>
        fetchAgentData(agentId)
      );
      const results = await Promise.all(dataPromises);

      const newAgentsData = {};
      results.forEach((data, index) => {
        if (data) {
          newAgentsData[selectedAgents[index]] = data;
        }
      });

      setAgentsData(newAgentsData);
      setLoading(false);
    };

    fetchAllSelectedAgentsData();
  }, [selectedAgents, token]);

  const handleAgentChange = (event) => {
    const {
      target: { value },
    } = event;

    // Convert the selection to an array if it's not already (handle string values)
    const newSelection = typeof value === "string" ? value.split(",") : value;

    // Limit the number of selectable agents to 2
    if (newSelection.length > 2) {
      toast.warn("You can only select up to 2 agents.");
    } else {
      setSelectedAgents(newSelection);

      // Clear chart selection when agent selection changes
      setSelectedCharts([]);
    }
  };

  const handleChartChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedCharts(typeof value === "string" ? value.split(",") : value);
  };

  const getColor = (index) => {
    // Expanded and more diverse set of colors for charts
    const colorPalette = [
      "#3498db", // Blue
      "#e74c3c", // Red
      "#2ecc71", // Green
      "#f39c12", // Yellow
      "#9b59b6", // Purple
      "#1abc9c", // Turquoise
      "#34495e", // Dark Gray
      "#f1c40f", // Gold
      "#e67e22", // Orange
      "#8e44ad", // Violet
      "#16a085", // Mint
      "#d35400", // Pumpkin
      "#c0392b", // Strong Red
      "#27ae60", // Strong Green
      "#2980b9", // Strong Blue
    ];

    // Return the color from the palette, ensuring it's unique for each dataset
    return colorPalette[index % colorPalette.length];
  };

  const processLineChartData = () => {
    // Color palette for agents
    const agentBaseColors = [
      "#2ecc71", // Green
      "#9b59b6", // Purple
      "#f39c12", // Yellow
      "#e67e22", // Orange
      "#1abc9c", // Turquoise
    ];

    const analyticsByAgent = {};
    selectedAgents.forEach((agentId) => {
      const data = agentsData[agentId];
      if (!data) return;

      data.forEach((call) => {
        const callDate = new Date(call.date).toLocaleDateString();
        if (!analyticsByAgent[agentId]) {
          analyticsByAgent[agentId] = {};
        }

        if (!analyticsByAgent[agentId][callDate]) {
          analyticsByAgent[agentId][callDate] = { total: 0, answered: 0 };
        }

        analyticsByAgent[agentId][callDate].total += 1;

        if (call.disposition === "Answered") {
          analyticsByAgent[agentId][callDate].answered += 1;
        }
      });
    });

    const allDates = [
      ...new Set(
        Object.values(analyticsByAgent).flatMap((agent) => Object.keys(agent))
      ),
    ].sort((a, b) => new Date(a) - new Date(b));

    const datasets = selectedAgents
      .map((agentId, agentIndex) => {
        const agentData = analyticsByAgent[agentId];
        const incomingData = allDates.map(
          (date) => agentData[date]?.total || 0
        );
        const answeredData = allDates.map(
          (date) => agentData[date]?.answered || 0
        );

        const baseColor = agentBaseColors[agentIndex % agentBaseColors.length];

        return [
          {
            label: `${
              agents.find((agent) => agent._id === agentId).fullName
            } - Incoming Calls`,
            data: incomingData,
            borderColor: lightenDarkenColor(baseColor, 40),
            backgroundColor: hexToRGBA(lightenDarkenColor(baseColor, 40), 0.3),
            tension: 0.4,
            fill: true,
          },
          {
            label: `${
              agents.find((agent) => agent._id === agentId).fullName
            } - Answered Calls`,
            data: answeredData,
            borderColor: lightenDarkenColor(baseColor, -40),
            backgroundColor: hexToRGBA(lightenDarkenColor(baseColor, -40), 0.3),
            tension: 0.4,
            fill: true,
          },
        ];
      })
      .flat();

    return { labels: allDates, datasets };
  };

  const processBarChartData = () => {
    // Use a gradient color generator
    const gradientColors = [
      "#2ecc71", // Green
      "#3498db", // Blue
      "#9b59b6", // Purple
      "#34495e", // Dark Blue
      "#f1c40f", // Yellow
      "#e67e22", // Orange
      "#e74c3c", // Red
      "#95a5a6", // Grey
    ];

    const dispositionCounts = {};
    selectedAgents.forEach((agentId) => {
      agentsData[agentId]?.forEach((call) => {
        const disposition = call.disposition || "Unknown";
        dispositionCounts[disposition] =
          (dispositionCounts[disposition] || 0) + 1;
      });
    });

    const labels = Object.keys(dispositionCounts);
    const data = Object.values(dispositionCounts);

    const datasets = [
      {
        label: "Dispositions",
        data,
        backgroundColor: labels.map(
          (_, index) => gradientColors[index % gradientColors.length]
        ),
      },
    ];

    return { labels, datasets };
  };

  const processPieChartData = () => {
    const dispositionCounts = {};

    selectedAgents.forEach((agentId) => {
      const data = agentsData[agentId];
      if (!data) return;

      data.forEach((call) => {
        const disposition = call.disposition || "Unknown";
        if (!dispositionCounts[disposition]) {
          dispositionCounts[disposition] = 0;
        }
        dispositionCounts[disposition] += 1;
      });
    });

    const labels = Object.keys(dispositionCounts);
    const data = Object.values(dispositionCounts);
    const backgroundColors = labels.map((_, index) => getColor(index));

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors,
        },
      ],
    };
  };

  const hexToRGBA = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const shadeColor = (color, percent) => {
    const num = parseInt(color.slice(1), 16);
    const r = (num >> 16) + percent;
    const g = ((num >> 8) & 0x00ff) + percent;
    const b = (num & 0x0000ff) + percent;
    return `#${(
      0x1000000 +
      (Math.min(255, Math.max(0, r)) << 16) +
      (Math.min(255, Math.max(0, g)) << 8) +
      Math.min(255, Math.max(0, b))
    )
      .toString(16)
      .slice(1)}`;
  };
  const lightenDarkenColor = (col, amt) => {
    let usePound = false;
    if (col[0] === "#") {
      col = col.slice(1);
      usePound = true;
    }

    const num = parseInt(col, 16);
    let r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    let g = (num & 0x0000ff) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    let b = ((num & 0x00ff00) >> 8) + amt;

    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
  };
  return (
    <Box p={3}>
      <Typography variant="h2" gutterBottom>
        Agent Analytics
      </Typography>

      <Grid container spacing={3}>
        {/* Agent Dropdown */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="agent-select-label">Agents</InputLabel>
            <Select
              labelId="agent-select-label"
              multiple
              value={selectedAgents}
              onChange={handleAgentChange}
              input={<OutlinedInput label="Agents" />}
              renderValue={(selected) =>
                selected
                  .map((id) => {
                    const agent = agents.find((a) => a._id === id);
                    return agent ? agent.fullName : "Unknown"; // Ensure the agent exists before accessing fullName
                  })
                  .join(", ")
              }
              MenuProps={MenuProps}
            >
              {/* Search Input */}
              <MenuItem>
                <OutlinedInput
                  value={searchTerm} // Bind the search term value to the text field
                  placeholder="Search Agents..."
                  onChange={handleSearchChange} // Call handleSearchChange when the input changes
                  margin="dense"
                  fullWidth
                />
              </MenuItem>

              {/* Filtered Agents List */}
              {agents
                .filter((agent) =>
                  agent.fullName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
                .map((agent) => (
                  <MenuItem key={agent._id} value={agent._id}>
                    <Checkbox
                      checked={selectedAgents.indexOf(agent._id) > -1}
                    />
                    <ListItemText primary={agent.fullName} />
                  </MenuItem>
                ))}

              {/* Option when no agents match */}
              {agents.filter((agent) =>
                agent.fullName.toLowerCase().includes(searchTerm.toLowerCase())
              ).length === 0 && <MenuItem disabled>No agents found</MenuItem>}
            </Select>
          </FormControl>
        </Grid>

        {/* Charts Dropdown */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Charts</InputLabel>
            <Select
              multiple
              value={selectedCharts}
              onChange={handleChartChange}
              input={<OutlinedInput label="Charts" />}
              MenuProps={MenuProps}
            >
              <MenuItem value="line">Line Chart</MenuItem>
              <MenuItem value="bar">Bar Chart</MenuItem>
              <MenuItem value="pie">Pie Chart</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ marginTop: "2rem" }}>
        {/* Line Chart */}
        {selectedCharts.includes("line") && (
          <Grid item xs={12} sm={6}>
            <Line
              data={processLineChartData()}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: "Calls Analytics (Line Chart)",
                  },
                },
              }}
            />
          </Grid>
        )}

        {/* Bar Chart */}
        {selectedCharts.includes("bar") && (
          <Grid item xs={12} sm={6}>
            <Bar
              data={processBarChartData()}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: "Disposition Analytics (Bar Chart)",
                  },
                },
              }}
            />
          </Grid>
        )}

        {/* Pie Chart */}
        {selectedCharts.includes("pie") && (
          <Grid item xs={12} sm={6}>
            <Pie
              data={processPieChartData()}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: "Disposition Analytics (Pie Chart)",
                  },
                },
              }}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default AgentAnalyticsWithDropdown;
