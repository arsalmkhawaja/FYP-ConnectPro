import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";

const CallLogs = () => {
  const navigate = useNavigate();
  const [callsData, setCallsData] = useState([]);
  const [agent, setAgent] = useState({
    _id: "",
    fullName: "",
  });
  const [agentLoaded, setAgentLoaded] = useState(false);
  const token = JSON.parse(localStorage.getItem("auth")) || "";

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Fetch agent profile
  useEffect(() => {
    const fetchAgentProfile = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/v1/agent", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const agentData = response.data.agent;
        if (agentData) {
          setAgent({
            _id: agentData._id,
            fullName: agentData.fullName,
          });
          setAgentLoaded(true);
        } else {
          console.log("No agent data returned from API.");
        }
      } catch (error) {
        console.error("Error fetching agent profile:", error);
        toast.error("Failed to fetch agent profile");
        navigate("/login");
      }
    };

    if (token) {
      fetchAgentProfile();
    } else {
      toast.warn("Please log in to access the dashboard");
      navigate("/login");
    }
  }, [token, navigate]);

  // Fetch calls for the logged-in agent
  useEffect(() => {
    if (agentLoaded && agent._id) {
      console.log("Fetching calls for agent with ID:", agent._id); // Log agent._id for debugging
      fetchAgentCallsData();
    }
  }, [agentLoaded, agent._id]); // Make sure you're using agent._id here

  const fetchAgentCallsData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/v5/agent/${agent._id}`, // Correct API endpoint
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCallsData(response.data); // Update calls data state
      console.log("Fetched Calls Data:", response.data);
    } catch (error) {
      toast.error("Failed to fetch call data");
      console.error(
        "Error fetching call data:",
        error.response?.data || error.message
      );
    }
  };

  const handleDownload = () => {
    const data = [
      [
        "Agent ID",
        "Agent Name",
        "Phone Number",
        "Campaign Name",
        "Duration",
        "Call Date",
        "Disposition",
        "Sentiment",
        "Transcription",
      ],
    ];

    callsData.forEach((call) => {
      data.push([
        call.agent?.agentID || "N/A",
        call.agent?.fullName || "N/A",
        call.phoneNumber || "N/A",
        call.campaign?.name || "N/A",
        call.duration !== undefined ? `${call.duration} seconds` : "N/A",
        call.date ? new Date(call.date).toLocaleDateString() : "N/A",
        call.disposition || "N/A",
        call.sentiment || "N/A",
        call.transcription || "N/A",
      ]);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Agent Call Report");
    XLSX.writeFile(workbook, "AgentCallsReport.xlsx");
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1
        style={{
          fontSize: "24px",
          marginBottom: "20px",
          color: colors.primary[100],
        }}
      >
        Agent Call Report for {agent.fullName}
      </h1>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
          fontSize: "12px",
        }}
      >
        <thead>
          <tr
            style={{ backgroundColor: colors.greenAccent[500], color: "white" }}
          >
            <th
              style={{
                padding: "10px",
                border: `1px solid ${colors.primary[300]}`,
                color: `${colors.primary[600]}`,
              }}
            >
              Agent ID
            </th>
            <th
              style={{
                padding: "10px",
                border: `1px solid ${colors.primary[300]}`,
                color: `${colors.primary[600]}`,
              }}
            >
              Agent Name
            </th>
            <th
              style={{
                padding: "10px",
                border: `1px solid ${colors.primary[300]}`,
                color: `${colors.primary[600]}`,
              }}
            >
              Phone Number
            </th>
            <th
              style={{
                padding: "10px",
                border: `1px solid ${colors.primary[300]}`,
                color: `${colors.primary[600]}`,
              }}
            >
              Campaign Name
            </th>
            <th
              style={{
                padding: "10px",
                border: `1px solid ${colors.primary[300]}`,
                color: `${colors.primary[600]}`,
              }}
            >
              Duration (seconds)
            </th>
            <th
              style={{
                padding: "10px",
                border: `1px solid ${colors.primary[300]}`,
                color: `${colors.primary[600]}`,
              }}
            >
              Call Date
            </th>
            <th
              style={{
                padding: "10px",
                border: `1px solid ${colors.primary[300]}`,
                color: `${colors.primary[600]}`,
              }}
            >
              Disposition
            </th>
            <th
              style={{
                padding: "10px",
                border: `1px solid ${colors.primary[300]}`,
                color: `${colors.primary[600]}`,
              }}
            >
              Sentiment
            </th>
            <th
              style={{
                padding: "10px",
                border: `1px solid ${colors.primary[300]}`,
                color: `${colors.primary[600]}`,
              }}
            >
              Transcription
            </th>
          </tr>
        </thead>
        <tbody>
          {callsData.map((call, index) => (
            <tr
              key={index}
              style={{
                backgroundColor: colors.primary[400],
                color: colors.primary[200],
              }}
            >
              <td
                style={{
                  padding: "10px",
                  border: `1px solid ${colors.primary[300]}`,
                  color: `${colors.gray[100]}`,
                }}
              >
                {call.agent?.agentID || "N/A"}
              </td>
              <td
                style={{
                  padding: "10px",
                  border: `1px solid ${colors.primary[300]}`,
                  color: `${colors.gray[100]}`,
                }}
              >
                {call.agent?.fullName || "N/A"}
              </td>
              <td
                style={{
                  padding: "10px",
                  border: `1px solid ${colors.primary[300]}`,
                  color: `${colors.gray[100]}`,
                }}
              >
                {call.phoneNumber || "N/A"}
              </td>
              <td
                style={{
                  padding: "10px",
                  border: `1px solid ${colors.primary[300]}`,
                  color: `${colors.gray[100]}`,
                }}
              >
                {call.campaign?.name || "N/A"}
              </td>
              <td
                style={{
                  padding: "10px",
                  border: `1px solid ${colors.primary[300]}`,
                  color: `${colors.gray[100]}`,
                }}
              >
                {call.duration !== undefined ? call.duration : "N/A"}
              </td>
              <td
                style={{
                  padding: "10px",
                  border: `1px solid ${colors.primary[300]}`,
                  color: `${colors.gray[100]}`,
                }}
              >
                {call.date ? new Date(call.date).toLocaleDateString() : "N/A"}
              </td>
              <td
                style={{
                  padding: "10px",
                  border: `1px solid ${colors.primary[300]}`,
                  color: `${colors.gray[100]}`,
                }}
              >
                {call.disposition || "N/A"}
              </td>
              <td
                style={{
                  padding: "10px",
                  border: `1px solid ${colors.primary[300]}`,
                  color: `${colors.gray[100]}`,
                }}
              >
                {call.sentiment || "N/A"}
              </td>
              <td
                style={{
                  padding: "10px",
                  border: `1px solid ${colors.primary[300]}`,
                  color: `${colors.gray[100]}`,
                }}
              >
                {call.transcription || "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleDownload}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: colors.greenAccent[500],
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          position: "absolute",
          top: "100px",
          right: "20px",
        }}
      >
        Download Report
      </button>
    </div>
  );
};

export default CallLogs;
