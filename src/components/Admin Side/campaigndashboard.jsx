import React, { useState, useEffect } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";

ChartJS.register(ArcElement, Tooltip, Legend);

const CampaignsManager = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [name, setName] = useState("");
  const [sales, setSales] = useState("");
  const [targetSales, setTargetSales] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addAgentVisible, setAddAgentVisible] = useState(false);
  const [removeAgentVisible, setRemoveAgentVisible] = useState(false);
  const [newAgentId, setNewAgentId] = useState("");
  const [removeAgentId, setRemoveAgentId] = useState("");
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState(null);
  const [viewAgentsVisible, setViewAgentsVisible] = useState(false);
  const [agents, setAgents] = useState([]);

  const navigate = useNavigate();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const token = JSON.parse(localStorage.getItem("auth")) || "";

  useEffect(() => {
    if (!token) {
      toast.warn("Please login first to access the dashboard");
      navigate("/login");
    } else {
      fetchCampaigns();
    }
  }, [token, navigate]);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v2/campaigns",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCampaigns(response.data.data);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      if (error.response && error.response.status === 401) {
        toast.error("Unauthorized access. Please login again.");
        navigate("/login");
      }
    }
  };

  const fetchAgents = async (campaignName) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/v2/campaigns/${campaignName}/agents`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data.data);
      setAgents(response.data.data);
    } catch (error) {
      console.error("Error fetching agents:", error);
      if (error.response && error.response.status === 404) {
        toast.error("Campaign not found.");
      }
    }
  };

  const createCampaign = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v2/campaigns",
        {
          name,
          sales,
          targetSales,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCampaigns([...campaigns, response.data.data]);
      closeModal();
    } catch (error) {
      console.error(
        "Error creating campaign:",
        error.response || error.message
      );
      if (error.response && error.response.status === 401) {
        toast.error("Unauthorized access. Please login again.");
        navigate("/login");
      }
    }
  };

  const updateCampaign = async () => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/v2/campaigns/${selectedCampaign.name}`,
        {
          name,
          sales,
          targetSales,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCampaigns(
        campaigns.map((campaign) =>
          campaign.name === selectedCampaign.name
            ? response.data.data
            : campaign
        )
      );
      closeModal();
    } catch (error) {
      console.error(
        "Error updating campaign:",
        error.response || error.message
      );
      if (error.response && error.response.status === 401) {
        toast.error("Unauthorized access. Please login again.");
        navigate("/login");
      }
    }
  };

  const deleteCampaign = async (name) => {
    try {
      await axios.delete(`http://localhost:4000/api/v2/campaigns/${name}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCampaigns(campaigns.filter((campaign) => campaign.name !== name));
    } catch (error) {
      console.error(
        "Error deleting campaign:",
        error.response || error.message
      );
      if (error.response && error.response.status === 401) {
        toast.error("Unauthorized access. Please login again.");
        navigate("/login");
      }
    }
  };

  const addAgentToCampaign = async () => {
    if (!newAgentId || !selectedCampaign) {
      toast.error("Please select a campaign and enter a valid agent ID.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:4000/api/v2/campaigns/${selectedCampaign.name}/agents`,
        { agentId: newAgentId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCampaigns(
        campaigns.map((campaign) =>
          campaign.name === selectedCampaign.name
            ? response.data.data
            : campaign
        )
      );
      toast.success("Agent added successfully.");
      closeAddAgentModal();
    } catch (error) {
      console.error(
        "Error adding agent to campaign:",
        error.response || error.message
      );
      if (error.response && error.response.status === 401) {
        toast.error("Unauthorized access. Please login again.");
        navigate("/login");
      } else {
        toast.error("Failed to add agent to the campaign.");
      }
    }
  };

  const removeAgentFromCampaign = async () => {
    if (!removeAgentId || !selectedCampaign) {
      toast.error("Please select a campaign and enter a valid agent ID.");
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:4000/api/v2/campaigns/${selectedCampaign.name}/agents`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { agentId: removeAgentId },
        }
      );
      setCampaigns(
        campaigns.map((campaign) =>
          campaign.name === selectedCampaign.name
            ? response.data.data
            : campaign
        )
      );
      toast.success("Agent removed successfully.");
      closeRemoveAgentModal();
    } catch (error) {
      console.error(
        "Error removing agent from campaign:",
        error.response || error.message
      );
      if (error.response && error.response.status === 401) {
        toast.error("Unauthorized access. Please login again.");
        navigate("/login");
      } else {
        toast.error("Failed to remove agent from the campaign.");
      }
    }
  };

  const handleEditClick = (campaign) => {
    setSelectedCampaign(campaign);
    setName(campaign.name || "");
    setSales(campaign.sales || 0);
    setTargetSales(campaign.targetSales || 0);
    setModalVisible(true);
  };

  const handleViewAgentsClick = (campaign) => {
    setSelectedCampaign(campaign);
    fetchAgents(campaign.name);
    setViewAgentsVisible(true);
  };

  const clearForm = () => {
    setName("");
    setSales(0);
    setTargetSales(0);
    setSelectedCampaign(null);
  };

  const closeModal = () => {
    setModalVisible(false);
    clearForm();
  };

  const openAddAgentModal = (campaign) => {
    setSelectedCampaign(campaign);
    setAddAgentVisible(true);
  };

  const closeAddAgentModal = () => {
    setAddAgentVisible(false);
    setNewAgentId("");
  };

  const openRemoveAgentModal = (campaign) => {
    setSelectedCampaign(campaign);
    setRemoveAgentVisible(true);
  };

  const closeRemoveAgentModal = () => {
    setRemoveAgentVisible(false);
    setRemoveAgentId("");
  };

  const openConfirmDeleteModal = (campaign) => {
    setCampaignToDelete(campaign);
    setConfirmDeleteVisible(true);
  };

  const closeConfirmDeleteModal = () => {
    setConfirmDeleteVisible(false);
    setCampaignToDelete(null);
  };

  const closeViewAgentsModal = () => {
    setViewAgentsVisible(false);
    setAgents([]);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <button
          style={{
            marginRight: "10px",
            padding: "10px 20px",
            backgroundColor: colors.greenAccent[500],
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={() => setModalVisible(true)}
        >
          Add Campaign
        </button>
      </div>

      {campaigns.map((campaign) => {
        const data = {
          labels: ["Sales", "Remaining"],
          datasets: [
            {
              data: [campaign.sales, campaign.targetSales - campaign.sales],
              backgroundColor: ["rgba(54,162,235,0.5)", "rgba(255,99,132,0.5)"],
            },
          ],
        };

        return (
          <div
            key={campaign.name}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "80%",
              backgroundColor: colors.primary[400],
              borderRadius: "10px",
              padding: "20px",
              marginBottom: "20px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ flex: 1, paddingLeft: "200px" }}>
              <h3>{campaign.name} Data</h3>
              <p>Number of Agents: {campaign.numberOfAgents}</p>
              <p>Sales Made: {campaign.sales}</p>
              <p>Target Sales: {campaign.targetSales}</p>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flex: 1,
              }}
            >
              <button
                style={{
                  marginBottom: "10px",
                  padding: "10px 20px",
                  backgroundColor: colors.blueAccent[600],
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={() => handleEditClick(campaign)}
              >
                Edit Campaign
              </button>
              <button
                style={{
                  marginBottom: "10px",
                  padding: "10px 20px",
                  backgroundColor: colors.greenAccent[500],
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={() => openAddAgentModal(campaign)}
              >
                Add Agent
              </button>
              <button
                style={{
                  marginBottom: "10px",
                  padding: "10px 20px",
                  backgroundColor: colors.blueAccent[600],
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={() => handleViewAgentsClick(campaign)}
              >
                View Agents
              </button>
              <button
                style={{
                  marginBottom: "10px",
                  padding: "10px 20px",
                  backgroundColor: colors.redAccent[600],
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={() => openRemoveAgentModal(campaign)}
              >
                Remove Agent
              </button>
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: colors.redAccent[600],
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={() => openConfirmDeleteModal(campaign)}
              >
                Delete Campaign
              </button>
            </div>

            <div style={{ flex: 2, height: "300px" }}>
              <Doughnut
                data={data}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </div>
        );
      })}

      {modalVisible && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "400px",
              textAlign: "center",
              color: theme.palette.mode === "dark" ? "black" : "inherit",
            }}
          >
            <h2>{selectedCampaign ? "Edit Campaign" : "Add Campaign"}</h2>
            <input
              type="text"
              placeholder="Campaign Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />
            <input
              type="number"
              placeholder="Sales"
              value={sales}
              onChange={(e) =>
                setSales(e.target.value === "" ? "" : Number(e.target.value))
              }
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />

            <input
              type="number"
              placeholder="Target Sales"
              value={targetSales}
              onChange={(e) =>
                setTargetSales(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
            />

            <button
              style={{
                padding: "10px 20px",
                backgroundColor: colors.greenAccent[500],
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={selectedCampaign ? updateCampaign : createCampaign}
            >
              {selectedCampaign ? "Update Campaign" : "Create Campaign"}
            </button>
            <button
              style={{
                marginLeft: "10px",
                padding: "10px 20px",
                backgroundColor: colors.redAccent[600],
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {addAgentVisible && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "400px",
              textAlign: "center",
              color: theme.palette.mode === "dark" ? "black" : "inherit",
            }}
          >
            <h2>Add Agent to Campaign</h2>
            <input
              type="text"
              placeholder="Agent ID"
              value={newAgentId}
              onChange={(e) => setNewAgentId(e.target.value)}
              style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
            />
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: colors.greenAccent[500],
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={addAgentToCampaign}
            >
              Add Agent
            </button>
            <button
              style={{
                marginLeft: "10px",
                padding: "10px 20px",
                backgroundColor: colors.redAccent[600],
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={closeAddAgentModal}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {viewAgentsVisible && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "400px",
              textAlign: "center",
              color: theme.palette.mode === "dark" ? "black" : "inherit", 
            }}
          >
            <h2>Agents in {selectedCampaign?.name}</h2>
            <ol>
              {agents.length > 0 ? (
                agents.map((agent) => (
                  <li key={agent._id}>
                    {agent.fullName} (ID: {agent.agentID})
                  </li>
                ))
              ) : (
                <p>No agents found in this campaign.</p>
              )}
            </ol>
            <button
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                backgroundColor: colors.blueAccent[600],
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={closeViewAgentsModal}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {confirmDeleteVisible && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "400px",
              textAlign: "center",
              color: theme.palette.mode === "dark" ? "black" : colors.gray[900],
            }}
          >
            <h2>Confirm Deletion</h2>
            <p>
              Are you sure you want to delete the campaign "
              {campaignToDelete?.name}"?
            </p>
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: colors.redAccent[600],
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginRight: "10px",
              }}
              onClick={() => {
                deleteCampaign(campaignToDelete.name);
                closeConfirmDeleteModal();
              }}
            >
              Yes, Delete
            </button>
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: colors.blueAccent[600],
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={closeConfirmDeleteModal}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {removeAgentVisible && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "400px",
              textAlign: "center",
              color: theme.palette.mode === "dark" ? "black" : colors.gray[900], 
            }}
          >
            <h2>Remove Agent from Campaign</h2>
            <input
              type="text"
              placeholder="Agent ID"
              value={removeAgentId}
              onChange={(e) => setRemoveAgentId(e.target.value)}
              style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
            />
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: colors.redAccent[600], 
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={removeAgentFromCampaign}
            >
              Remove Agent
            </button>
            <button
              style={{
                marginLeft: "10px",
                padding: "10px 20px",
                backgroundColor: colors.redAccent[600], 
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={closeRemoveAgentModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignsManager;
