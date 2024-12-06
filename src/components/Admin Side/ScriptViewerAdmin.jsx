import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ScriptViewerAdmin = () => {
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("auth")) || "";
  const [scripts, setScripts] = useState([]);
  const [newScriptTitle, setNewScriptTitle] = useState("");
  const [newScriptContent, setNewScriptContent] = useState("");
  const [selectedScript, setSelectedScript] = useState(null); // For popup

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
      setScripts(response.data);
    } catch (error) {
      console.error("Error fetching scripts:", error);
      toast.error("Failed to load scripts.");
    }
  };

  const handleAddScript = async () => {
    if (newScriptTitle && newScriptContent) {
      try {
        const response = await axios.post(
          "http://localhost:4000/api/v7/scripts",
          { name: newScriptTitle, script: newScriptContent },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setScripts([...scripts, response.data]);
        setNewScriptTitle("");
        setNewScriptContent("");
        toast.success("Script added successfully!");
      } catch (error) {
        console.error("Error adding script:", error);
        toast.error("Failed to add script.");
      }
    } else {
      toast.warn("Please provide both title and content for the script.");
    }
  };

  const handleRemoveScript = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/v7/scripts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setScripts(scripts.filter((script) => script._id !== id));
      toast.success("Script deleted successfully!");
    } catch (error) {
      console.error("Error deleting script:", error);
      toast.error("Failed to delete script.");
    }
  };

  const handleScriptClick = (script) => {
    setSelectedScript(script); // Open popup for the selected script
  };

  const handleClosePopup = () => {
    setSelectedScript(null); // Close popup
  };

  // Styles
  const containerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)", // 3 columns per row
    gap: "15px",
    justifyContent: "space-between",
    alignItems: "stretch",
  };

  const scriptItemStyle = {
    padding: "15px",
    border: "1px solid #007bff",
    borderRadius: "8px",
    backgroundColor: "#f8f9fa",
    textAlign: "left",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "all 0.2s ease",
    minWidth: "250px", // Ensures items don't shrink too small
  };

  const scriptTitleStyle = {
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "18px",
    color: "#4cceac",
  };

  const inputStyle = {
    margin: "10px 0",
    padding: "10px",
    width: "100%",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
    fontSize: "16px",
  };

  const scriptButtonStyle = {
    margin: "10px",
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
  };

  const removeButtonStyle = {
    marginTop: "10px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "7px 15px",
    cursor: "pointer",
    borderRadius: "5px",
    fontWeight: "bold",
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
    overflow: "hidden",
    textAlign: "center",
  };

  const popupContentStyle = {
    wordWrap: "break-word", // Prevents text from overflowing
    maxHeight: "400px", // Ensures the text doesn't extend too far
    overflowY: "auto", // Adds a scroll bar if content exceeds the max height
    color: "black", // Updated to black text color
    padding: "10px",
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

  // Style for script content preview box (on hover, only a part of the content will be shown)
  const scriptPreviewStyle = {
    display: "block",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100%",
    color: "#6c757d",
    marginTop: "10px",
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

      <div style={containerStyle}>
        {scripts.length > 0 ? (
          scripts.map((script, index) => (
            <div
              key={script._id}
              style={scriptItemStyle}
              className={
                index % 3 === 0 && scripts.length % 3 !== 0 ? "last-item" : ""
              }
            >
              <h4
                style={scriptTitleStyle}
                onClick={() => handleScriptClick(script)}
              >
                {script.name}
              </h4>
              <p style={scriptPreviewStyle}>
                {script.script.slice(0, 100)}... {/* Show only a preview */}
              </p>
              <button
                style={removeButtonStyle}
                onClick={() => handleRemoveScript(script._id)}
              >
                Remove Script
              </button>
            </div>
          ))
        ) : (
          <p style={{ fontSize: "16px", color: "#6c757d" }}>
            No scripts available.
          </p>
        )}
      </div>

      {/* Popup Overlay */}
      {selectedScript && (
        <>
          <div style={overlayStyle} onClick={handleClosePopup}></div>
          <div style={popupStyle}>
            <button style={closeButtonStyle} onClick={handleClosePopup}>
              X
            </button>
            <h4 style={{ color: "#333", fontWeight: "bold" }}>
              {selectedScript.name}
            </h4>
            <div style={popupContentStyle}>
              <p>{selectedScript.script}</p> {/* Full content in popup */}
            </div>
          </div>
        </>
      )}

      {/* Add Script Form */}
      <div style={{ marginTop: "40px" }}>
        <input
          type="text"
          placeholder="Enter script title"
          style={inputStyle}
          value={newScriptTitle}
          onChange={(e) => setNewScriptTitle(e.target.value)}
        />
        <textarea
          placeholder="Enter script content"
          style={inputStyle}
          rows="5"
          value={newScriptContent}
          onChange={(e) => setNewScriptContent(e.target.value)}
        />
        <button style={scriptButtonStyle} onClick={handleAddScript}>
          Add Script
        </button>
      </div>
    </div>
  );
};

export default ScriptViewerAdmin;
