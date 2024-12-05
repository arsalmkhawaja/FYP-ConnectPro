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

  // Fetch all scripts from the backend on component mount
  useEffect(() => {
    if (!token) {
      toast.warn("Please login first to access the dashboard");
      navigate("/login");
    } else {
      fetchScripts(); // Call the function to fetch scripts
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

  // Add a new script to the backend
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
        setScripts([...scripts, response.data]); // Add the new script to the state
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

  // Remove a script by ID
  const handleRemoveScript = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/v7/scripts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setScripts(scripts.filter((script) => script._id !== id)); // Remove script from the state
      toast.success("Script deleted successfully!");
    } catch (error) {
      console.error("Error deleting script:", error);
      toast.error("Failed to delete script.");
    }
  };

  // Handle clicking on a script (optional enhancement)
  const handleScriptClick = (script) => {
    console.log("Clicked script:", script); // Future feature can show detailed view
  };

  // Styles
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

  const inputStyle = {
    margin: "10px 0",
    padding: "10px",
    width: "100%",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
    fontSize: "16px",
  };

  const scriptItemStyle = {
    marginBottom: "15px",
    padding: "15px",
    border: "1px solid #007bff",
    borderRadius: "8px",
    backgroundColor: "#f8f9fa",
    textAlign: "left",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "all 0.2s ease",
  };

  const scriptTitleStyle = {
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "18px",
    color: "#4cceac",
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
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#e9ecef")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#f8f9fa")
            }
          >
            <h4
              style={scriptTitleStyle}
              onClick={() => handleScriptClick(script)}
            >
              {script.name}
            </h4>
            <p style={{ fontSize: "16px", color: "#6c757d" }}>
              {script.script}
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

      <h3 style={{ fontWeight: "bold", margin: "20px 0 10px" }}>
        Add New Script
      </h3>
      <input
        type="text"
        placeholder="Script Title"
        value={newScriptTitle}
        onChange={(e) => setNewScriptTitle(e.target.value)}
        style={inputStyle}
      />
      <textarea
        placeholder="Script Content"
        value={newScriptContent}
        onChange={(e) => setNewScriptContent(e.target.value)}
        style={{ ...inputStyle, height: "100px" }}
      />
      <button
        style={{
          ...scriptButtonStyle,
          backgroundColor: "#28a745",
          marginTop: "10px",
        }}
        onClick={handleAddScript}
      >
        Add Script
      </button>
    </div>
  );
};

export default ScriptViewerAdmin;
