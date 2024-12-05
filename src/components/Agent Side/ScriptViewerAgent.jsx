import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ScriptViewerAgent = () => {
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("auth")) || "";
  const [scripts, setScripts] = useState([]);
  const [expandedScriptId, setExpandedScriptId] = useState(null); // Tracks which script is expanded

  useEffect(() => {
    if (!token) {
      toast.warn("Please login first to access the dashboard");
      navigate("/login");
    } else {
      fetchScripts();
    }
  }, [token, navigate]);

  const fetchScripts = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/v7/scripts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setScripts(response.data); // Update state with fetched scripts
    } catch (error) {
      console.error("Error fetching scripts:", error);
      toast.error("Failed to load scripts.");
    }
  };

  // Toggle the expanded script view
  const handleScriptClick = (id) => {
    setExpandedScriptId(expandedScriptId === id ? null : id);
  };

  // Styles
  const scriptItemStyle = {
    marginBottom: "10px",
    padding: "15px",
    border: "1px solid #007bff",
    borderRadius: "8px",
    backgroundColor: "#f8f9fa",
    cursor: "pointer",
    textAlign: "left",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "all 0.2s ease",
  };

  const scriptTitleStyle = {
    fontWeight: "bold",
    fontSize: "18px",
    color: "#007bff",
  };

  const scriptContentStyle = {
    marginTop: "10px",
    fontSize: "16px",
    color: "#6c757d",
    whiteSpace: "pre-wrap", // Ensures line breaks are respected
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3
        style={{
          fontWeight: "bold",
          marginBottom: "20px",
          fontSize: "40px",
          color: "#4cceac",
        }}
      >
        Scripts
      </h3>

      {scripts.length > 0 ? (
        scripts.map((script) => (
          <div
            key={script._id}
            style={scriptItemStyle}
            onClick={() => handleScriptClick(script._id)}
          >
            <h4 style={scriptTitleStyle}>{script.name}</h4>
            {expandedScriptId === script._id && (
              <p style={scriptContentStyle}>{script.script}</p>
            )}
          </div>
        ))
      ) : (
        <p style={{ fontSize: "16px", color: "#6c757d" }}>
          No scripts available.
        </p>
      )}
    </div>
  );
};

export default ScriptViewerAgent;
