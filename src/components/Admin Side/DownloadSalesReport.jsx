import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Modal from "react-modal";

Modal.setAppElement("#root");

const DownloadSalesReport = () => {
  const navigate = useNavigate();
  const [salesData, setSalesData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentSale, setCurrentSale] = useState({
    agent: { agentID: "", fullName: "" },
    form: { email: "", phoneNumber: "", address: "", comments: "" },
    campaign: { name: "" },
    amount: "",
    saleDate: "",
    score: "",
    sentiment: "Neutral",
  });
  const token = JSON.parse(localStorage.getItem("auth")) || "";

  useEffect(() => {
    if (!token) {
      toast.warn("Please login first to access the dashboard");
      navigate("/login");
    } else {
      fetchSalesData();
    }
  }, [token, navigate]);

  const fetchSalesData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/v4/sales", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSalesData(response.data);
    } catch (error) {
      toast.error("Failed to fetch sales data");
      console.error("Error fetching sales data:", error);
    }
  };

  const handleDownload = () => {
    const data = [
      [
        "Agent ID",
        "Agent Name",
        "Email",
        "Phone Number",
        "Address",
        "Comments",
        "Campaign Name",
        "Amount",
        "Sale Date",
        "Score",
        "Sentiment",
      ],
    ];

    salesData.forEach((sale) => {
      data.push([
        sale.agent?.agentID || "N/A",
        sale.agent?.fullName || "N/A",
        sale.form?.email || "N/A",
        sale.form?.phoneNumber || "N/A",
        sale.form?.address || "N/A",
        sale.form?.comments || "N/A",
        sale.campaign?.name || "N/A",
        sale.amount !== undefined ? `$${sale.amount.toFixed(2)}` : "N/A",
        sale.saleDate ? new Date(sale.saleDate).toLocaleDateString() : "N/A",
        sale.score !== undefined ? sale.score : "N/A",
        sale.sentiment || "N/A",
      ]);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report");
    XLSX.writeFile(workbook, "SalesReport.xlsx");
  };

  const openModal = (sale = null) => {
    setCurrentSale(
      sale || {
        agent: { agentID: "", fullName: "" },
        form: { email: "", phoneNumber: "", address: "", comments: "" },
        campaign: { name: "" },
        amount: "",
        saleDate: "",
        score: "",
        sentiment: "Neutral",
      }
    );
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentSale({
      agent: { agentID: "", fullName: "" },
      form: { email: "", phoneNumber: "", address: "", comments: "" },
      campaign: { name: "" },
      amount: "",
      saleDate: "",
      score: "",
      sentiment: "Neutral",
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Ensure all fields are filled out
    if (
      !currentSale.agent.agentID ||
      !currentSale.campaign.name ||
      !currentSale.form.email ||
      !currentSale.amount
    ) {
      toast.error("Please fill out all required fields");
      return;
    }

    try {
      if (currentSale._id) {
        await axios.put(
          `http://localhost:4000/api/v4/sales/${currentSale._id}`,
          currentSale,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Sale updated successfully");
      } else {
        await axios.post("http://localhost:4000/api/v4/sales", currentSale, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Sale created successfully");
      }
      fetchSalesData();
      closeModal();
    } catch (error) {
      toast.error("Failed to save sale");
      console.error(
        "Error saving sale:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleDelete = async (saleId) => {
    if (window.confirm("Are you sure you want to delete this sale?")) {
      try {
        await axios.delete(`http://localhost:4000/api/v4/sales/${saleId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Sale deleted successfully");
        fetchSalesData();
      } catch (error) {
        toast.error("Failed to delete sale");
        console.error(
          "Error deleting sale:",
          error.response ? error.response.data : error.message
        );
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentSale((prevSale) => {
      const updatedSale = { ...prevSale };
      if (name.includes("agent")) {
        updatedSale.agent = {
          ...updatedSale.agent,
          [name.split(".")[1]]: value,
        };
      } else if (name.includes("form")) {
        updatedSale.form = { ...updatedSale.form, [name.split(".")[1]]: value };
      } else if (name.includes("campaign")) {
        updatedSale.campaign = {
          ...updatedSale.campaign,
          [name.split(".")[1]]: value,
        };
      } else {
        updatedSale[name] = value;
      }
      return updatedSale;
    });
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>Sales Report</h1>
      <button
        onClick={() => openModal()}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Add New Sale
      </button>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
          fontSize: "12px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#4CAF50", color: "white" }}>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>
              Agent ID
            </th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>
              Agent Name
            </th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Email</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>
              Phone Number
            </th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>
              Address
            </th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>
              Comments
            </th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>
              Campaign Name
            </th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>
              Amount
            </th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>
              Sale Date
            </th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Score</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>
              Sentiment
            </th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {salesData.map((sale, index) => (
            <tr key={index}>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {sale.agent?.agentID || "N/A"}
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {sale.agent?.fullName || "N/A"}
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {sale.form?.email || "N/A"}
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {sale.form?.phoneNumber || "N/A"}
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {sale.form?.address || "N/A"}
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {sale.form?.comments || "N/A"}
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {sale.campaign?.name || "N/A"}
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                ${sale.amount !== undefined ? sale.amount.toFixed(2) : "N/A"}
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {sale.saleDate
                  ? new Date(sale.saleDate).toLocaleDateString()
                  : "N/A"}
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {sale.score || "N/A"}
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {sale.sentiment || "N/A"}
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                <button
                  onClick={() => openModal(sale)}
                  style={{
                    padding: "5px 10px",
                    fontSize: "12px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "3px",
                    cursor: "pointer",
                    marginRight: "5px",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(sale._id)}
                  style={{
                    padding: "5px 10px",
                    fontSize: "12px",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "3px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
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
          backgroundColor: "#4CAF50",
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

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "400px",
            padding: "20px",
          },
        }}
      >
        <h2>{currentSale && currentSale._id ? "Edit Sale" : "Add New Sale"}</h2>
        <form onSubmit={handleSave}>
          <div style={{ marginBottom: "10px" }}>
            <label>Agent ID:</label>
            <input
              type="text"
              name="agent.agentID"
              value={currentSale.agent.agentID}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
              required
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Agent Name:</label>
            <input
              type="text"
              name="agent.fullName"
              value={currentSale.agent.fullName}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
              required
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Email:</label>
            <input
              type="email"
              name="form.email"
              value={currentSale.form.email}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
              required
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Phone Number:</label>
            <input
              type="text"
              name="form.phoneNumber"
              value={currentSale.form.phoneNumber}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
              required
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Address:</label>
            <input
              type="text"
              name="form.address"
              value={currentSale.form.address}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
              required
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Comments:</label>
            <input
              type="text"
              name="form.comments"
              value={currentSale.form.comments}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Campaign Name:</label>
            <input
              type="text"
              name="campaign.name"
              value={currentSale.campaign.name}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
              required
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Amount:</label>
            <input
              type="number"
              name="amount"
              value={currentSale.amount}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
              required
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Score:</label>
            <input
              type="number"
              name="score"
              value={currentSale.score}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
              required
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Sentiment:</label>
            <select
              name="sentiment"
              value={currentSale.sentiment}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
              required
            >
              <option value="Positive">Positive</option>
              <option value="Neutral">Neutral</option>
              <option value="Negative">Negative</option>
            </select>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Sale Date:</label>
            <input
              type="date"
              name="saleDate"
              value={
                currentSale.saleDate
                  ? new Date(currentSale.saleDate).toISOString().substr(0, 10)
                  : ""
              }
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
              required
            />
          </div>
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Save
          </button>
          <button
            type="button"
            onClick={closeModal}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginLeft: "10px",
            }}
          >
            Cancel
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default DownloadSalesReport;
