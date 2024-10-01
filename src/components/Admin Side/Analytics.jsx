import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import agentsdata from "../../assets/analyticsagentsdata.json";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AgentAnalyticsDashboard = () => {
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("auth")) || "";
  useEffect(() => {
    if (!token) {
      toast.warn("Please login first to access the dashboard");
      navigate("/login");
    }
  }, [token, navigate]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedAgent, setSelectedAgent] = useState("agent1");
  const [chartType, setChartType] = useState("attendance");
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
  const [callDisposition, setCallDisposition] = useState({});
  const [workingHours, setWorkingHours] = useState(0);

  useEffect(() => {
    let agentChartInstance;
    let comparisonChartInstance;

    const updateCharts = () => {
      const agentCtx = document
        .getElementById("agentChartCanvas")
        .getContext("2d");
      const comparisonCtx = document
        .getElementById("comparisonChartCanvas")
        .getContext("2d");

      const agentData =
        selectedAgent === "Overall Comparison"
          ? agentsdata.allagent[chartType]
          : agentsdata[selectedAgent][chartType];

      const labels = agentData.labels;
      const dataValues = agentData.values;

      const chartOptions = {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      };

      const newAgentChartData = {
        labels,
        datasets: [
          {
            label: `${agentData.chartLabel} for ${selectedAgent}`,
            data: dataValues,
            backgroundColor:
              selectedChartType === "bar"
                ? "rgba(75, 192, 192, 0.2)"
                : "rgba(54, 162, 235, 0.2)",
            borderColor:
              selectedChartType === "bar"
                ? "rgba(75, 192, 192, 1)"
                : "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      };

      const overallData =
        selectedAgent === "Overall Comparison"
          ? agentsdata.allagent[chartType].values
          : dataValues.map(() => Math.floor(Math.random() * 100));

      const newComparisonChartData = {
        labels,
        datasets: [
          {
            label: `Overall ${agentData.chartLabel} Comparison`,
            data: overallData,
            backgroundColor:
              selectedChartType === "bar"
                ? "rgba(153, 102, 255, 0.2)"
                : "rgba(255, 159, 64, 0.2)",
            borderColor:
              selectedChartType === "bar"
                ? "rgba(153, 102, 255, 1)"
                : "rgba(255, 159, 64, 1)",
            borderWidth: 1,
          },
        ],
      };

      setChartData(newAgentChartData);
      setComparisonData(newComparisonChartData);

      if (selectedAgent !== "Overall Comparison") {
        setTotalCalls(agentsdata[selectedAgent].totalCalls);
        setCallDisposition(agentsdata[selectedAgent].callDisposition);
        setWorkingHours(agentsdata[selectedAgent].workingHours);
      } else {
        setTotalCalls(agentsdata.allagent.totalCalls);
        setCallDisposition(agentsdata.allagent.callDisposition);
        setWorkingHours(agentsdata.allagent.workingHours);
      }

      if (agentChartInstance) {
        agentChartInstance.destroy();
      }
      if (comparisonChartInstance) {
        comparisonChartInstance.destroy();
      }

      agentChartInstance = new Chart(agentCtx, {
        type: selectedChartType,
        data: newAgentChartData,
        options: chartOptions,
      });

      comparisonChartInstance = new Chart(comparisonCtx, {
        type: selectedChartType,
        data: newComparisonChartData,
        options: chartOptions,
      });
    };

    updateCharts();

    return () => {
      if (agentChartInstance) {
        agentChartInstance.destroy();
      }
      if (comparisonChartInstance) {
        comparisonChartInstance.destroy();
      }
    };
  }, [selectedAgent, chartType, selectedChartType]);

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
          Agent Analytics Dashboard
        </h1>
        <div>
          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
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
            <option value="Overall Comparison">Overall Comparison</option>
            {Object.keys(agentsdata)
              .filter((agent) => agent !== "allagent")
              .map((agent, index) => (
                <option key={index} value={agent}>
                  {agent}
                </option>
              ))}
          </select>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
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
            <option value="attendance">Attendance</option>
            <option value="salesComparative">Sales Comparative</option>
            <option value="performanceAnalysis">Performance Analysis</option>
            <option value="inboundCalls">Inbound Calls</option>
            <option value="outboundCalls">Outbound Calls</option>
            <option value="callsTransferred">Calls Transferred</option>
            <option value="comparativeCampaignSales">
              Comparative Campaign Sales
            </option>
            <option value="campaignSuccess">Campaign Success</option>
            <option value="scorecard">Scorecard</option>
            <option value="lateEntry">Late Entry</option>
            <option value="targetsAchieved">Targets Achieved</option>
          </select>
          <select
            value={selectedChartType}
            onChange={(e) => setSelectedChartType(e.target.value)}
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
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="pie">Pie</option>
            <option value="doughnut">Doughnut</option>
            <option value="radar">Radar</option>
            <option value="polarArea">Polar Area</option>
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
          <p>
            Call Disposition: Answered: {callDisposition.answered}, Unanswered:{" "}
            {callDisposition.unanswered}
          </p>
          <p>Working Hours: {workingHours} hours</p>
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
          <canvas
            id="comparisonChartCanvas"
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
