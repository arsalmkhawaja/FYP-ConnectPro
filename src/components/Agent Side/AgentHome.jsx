import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { toast } from "react-toastify";
import axios from "axios";
import { Box, Typography, Grid, Card, CardContent, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css"; // Import default styles

// Set up the localizer using date-fns
const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const AgentHome = () => {
  const navigate = useNavigate();
  const [callsData, setCallsData] = useState([]);
  const [lineChartData, setLineChartData] = useState(null);
  const [topAgents, setTopAgents] = useState([]);
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

    const fetchDashboardData = async () => {
      try {
        const agentProfileResponse = await axios.get("http://localhost:4000/api/v1/agent", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const agent = agentProfileResponse.data.agent;

        if (!agent || !agent._id) {
          throw new Error("Agent data not found");
        }

        const callsResponse = await axios.get(`http://localhost:4000/api/v5/agent/${agent._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const callLogs = callsResponse.data;
        setCallsData(callLogs);

        setLineChartData(processLineChartData(callLogs));
        setTopAgents(processTopAgents(callLogs));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to fetch dashboard data");
        if (error.response?.status === 401) navigate("/login");
      }
    };

    fetchDashboardData();
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

  const processTopAgents = (data) => {
    const agentStats = {};

    data.forEach((call) => {
      const agentName = call.agentName || call.agent?.name || "Unknown Agent";

      if (!agentStats[agentName]) {
        agentStats[agentName] = { answered: 0, abandoned: 0, satisfaction: 0, count: 0 };
      }

      if (call.disposition === "Answered") {
        agentStats[agentName].answered += 1;
      } else {
        agentStats[agentName].abandoned += 1;
      }

      agentStats[agentName].satisfaction += call.satisfaction || 0;
      agentStats[agentName].count += 1;
    });

    return Object.keys(agentStats).map((agentName) => ({
      name: agentName,
      answeredCalls: agentStats[agentName].answered,
      abandonedCalls: agentStats[agentName].abandoned,
      satisfaction: (agentStats[agentName].satisfaction / agentStats[agentName].count).toFixed(1),
    }));
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h3" gutterBottom>
        Agent Dashboard
      </Typography>

      <Grid container spacing={4}>
        {/* Line Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Overall Calls Volume
              </Typography>
              <Line data={lineChartData} options={chartOptions} />
            </CardContent>
          </Card>
        </Grid>

        {/* Calendar */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h3" gutterBottom>
                Calendar
              </Typography>
              <Calendar
                localizer={localizer}
                events={[]}
                startAccessor="start"
                endAccessor="end"
                style={{
                  height: "500px",
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  borderRadius: "8px",
                  fontFamily: theme.typography.fontFamily,
                }}
                views={['month', 'week']}
                toolbar={true}
                eventPropGetter={() => ({
                  style: {
                    backgroundColor: colors.blueAccent[500],
                    color: theme.palette.text.primary,
                  },
                })}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Top Agents */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h3" gutterBottom>
                Top Agents This Week
              </Typography>
              <Box sx={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: colors.primary[500], color: colors.gray[100] }}>
                      <th style={{ padding: "8px", textAlign: "left" }}>Agent</th>
                      <th style={{ padding: "8px", textAlign: "left" }}>Answered</th>
                      <th style={{ padding: "8px", textAlign: "left" }}>Abandoned</th>
                      <th style={{ padding: "8px", textAlign: "left" }}>Cust. Satisfaction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topAgents.map((agent) => (
                      <tr key={agent.name} style={{ borderBottom: `1px solid ${colors.gray[300]}` }}>
                        <td style={{ padding: "8px" }}>{agent.name}</td>
                        <td style={{ padding: "8px" }}>{agent.answeredCalls}</td>
                        <td style={{ padding: "8px" }}>{agent.abandonedCalls}</td>
                        <td style={{ padding: "8px" }}>{agent.satisfaction}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AgentHome;
