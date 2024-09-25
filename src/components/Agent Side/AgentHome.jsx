import React from "react";
import { Line } from "react-chartjs-2";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Layout.css";
import data from "./data.json";
import {
  FaPhone,
  FaCheckCircle,
  FaTimesCircle,
  FaPhoneAlt,
} from "react-icons/fa";

// Register the components
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
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Answered Calls",
        data: agentData.callsVolume.answeredCalls,
        borderColor: "purple",
        backgroundColor: "rgba(128, 0, 128, 0.1)",
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

  // Sort agents by answered calls and get the top 5
  const topAgents = data.agents
    .sort((a, b) => b.callMetrics.answeredCalls - a.callMetrics.answeredCalls)
    .slice(0, 5);

  return (
    <div className="dashboard">
      <div className="metrics-container">
        <div className="metric-card incoming">
          <FaPhone className="metric-icon blue-icon" />
          <div className="metric-title">Incoming Calls</div>
          <div className="metric-value">
            {agentData.callMetrics.incomingCalls}
          </div>
        </div>
        <div className="metric-card answered">
          <FaCheckCircle className="metric-icon blue-icon" />
          <div className="metric-title">Answered Calls</div>
          <div className="metric-value">
            {agentData.callMetrics.answeredCalls}
          </div>
        </div>
        <div className="metric-card abandoned">
          <FaTimesCircle className="metric-icon blue-icon" />
          <div className="metric-title">Abandoned Calls</div>
          <div className="metric-value">
            {agentData.callMetrics.abandonedCalls}
          </div>
        </div>
        <div className="metric-card total">
          <FaPhoneAlt className="metric-icon blue-icon" />
          <div className="metric-title">Total Calls</div>
          <div className="metric-value">{agentData.callMetrics.totalCalls}</div>
        </div>
      </div>

      <div className="chart-container small-chart">
        <div className="chart-header">
          <div className="overall-volume-title">Overall Calls Volume</div>
        </div>
        <Line data={chartData} options={chartOptions} />
      </div>

      <div className="additional-sections">
        <div className="agents-section">
          <h2>Best Agents This Week</h2>
          <table>
            <thead>
              <tr>
                <th>Agent</th>
                <th>Answered</th>
                <th>Abandoned</th>
                <th>Cust. Satisfaction</th>
              </tr>
            </thead>
            <tbody>
              {topAgents.map((agent) => (
                <tr key={agent.name}>
                  <td>{agent.name}</td>
                  <td>{agent.callMetrics.answeredCalls}</td>
                  <td>{agent.callMetrics.abandonedCalls}</td>
                  <td>{agent.satisfaction}/5</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="calendar-section">
          <h2>Calendar</h2>
          <Calendar />
        </div>
      </div>
    </div>
  );
};

export default AgentHome;
