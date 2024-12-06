import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ScriptViewerAgent = () => {
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("auth")) || "";
  const [scripts, setScripts] = useState([]);
  const [selectedScript, setSelectedScript] = useState(null); // For the popup box

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

  // Open the popup for a selected script
  const handleScriptClick = (script) => {
    setSelectedScript(script);
  };

  // Close the popup
  const handleClosePopup = () => {
    setSelectedScript(null);
  };

  // Updated Styles
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)", // Maximum of 3 cards per row
    gap: "25px",
    marginTop: "30px",
  };

  const cardStyle = {
    padding: "20px",
    borderRadius: "15px",
    backgroundColor: "#f8f9fa",
    color: "black",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  };

  const cardHoverStyle = {
    ...cardStyle,
    transform: "scale(1.08)",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
  };

  const cardTitleStyle = {
    fontWeight: "600",
    fontSize: "22px",
    marginBottom: "15px",
    color: "black",
  };

  const popupStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.4)",
    zIndex: 1000,
    width: "90%",
    maxWidth: "600px",
    overflow: "hidden", // Ensures content stays within the box
    textAlign: "center",
  };

  const popupContentStyle = {
    wordWrap: "break-word", // Prevents text from overflowing
    maxHeight: "400px", // Ensures the text doesn't extend too far
    overflowY: "auto", // Adds a scroll bar if content exceeds the max height
    color: "#495057",
  };

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    zIndex: 999,
  };

  const closeButtonStyle = {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "#ff6b6b",
    border: "none",
    color: "#ffffff",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const noScriptsStyle = {
    fontSize: "18px",
    color: "#adb5bd",
  };

  return (
    <div style={{ padding: "30px" }}>
      <h3
        style={{
          fontWeight: "bold",
          marginBottom: "30px",
          fontSize: "36px",
          color: "#20c997",
          textAlign: "center",
        }}
      >
        Available Scripts
      </h3>

      <div style={gridStyle}>
        {scripts.length > 0 ? (
          scripts.map((script) => (
            <div
              key={script._id}
              style={cardStyle}
              onClick={() => handleScriptClick(script)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.08)";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(0, 0, 0, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0, 0, 0, 0.1)";
              }}
            >
              <h4 style={cardTitleStyle}>{script.name}</h4>
              <p>{script.description || "Click to view details"}</p>
            </div>
          ))
        ) : (
          <p style={noScriptsStyle}>No scripts available.</p>
        )}
      </div>

      {selectedScript && (
        <>
          <div style={overlayStyle} onClick={handleClosePopup}></div>
          <div style={popupStyle}>
            <button style={closeButtonStyle} onClick={handleClosePopup}>
              &times;
            </button>
            <h4 style={cardTitleStyle}>{selectedScript.name}</h4>
            <div style={popupContentStyle}>
              <p>{selectedScript.script}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ScriptViewerAgent;
