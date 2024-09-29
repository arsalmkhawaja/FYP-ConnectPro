import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";

const DownloadSalesReport = () => {
  const navigate = useNavigate();
  const [salesData, setSalesData] = useState([]);
  const token = JSON.parse(localStorage.getItem("auth")) || "";

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    if (!token) {
      toast.warn("Please login first to access the dashboard");
      navigate("/login");
    } else {
      fetchSalesData();
    }
  }, [token, navigate]);

  const fetchFormDataById = async (formId) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/v3/forms/${formId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      toast.error("Failed to fetch form data");
      console.error("Error fetching form data:", error);
      return null;
    }
  };

  const fetchSalesData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/v4/sales", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const salesWithDetails = await Promise.all(
        response.data.map(async (sale) => {
          const formData = await fetchFormDataById(sale.form);
          return {
            ...sale,
            form: formData || {
              email: "N/A",
              phoneNumber: "N/A",
              address: "N/A",
              comments: "N/A",
            },
          };
        })
      );

      setSalesData(salesWithDetails);
      console.log("Fetched Sales Data with Forms:", salesWithDetails);
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

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1
        style={{
          fontSize: "24px",
          marginBottom: "20px",
          color: colors.primary[100],
        }}
      >
        Sales Report
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
              Email
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
              Address
            </th>
            <th
              style={{
                padding: "10px",
                border: `1px solid ${colors.primary[300]}`,
                color: `${colors.primary[600]}`,
              }}
            >
              Comments
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
              Amount
            </th>
            <th
              style={{
                padding: "10px",
                border: `1px solid ${colors.primary[300]}`,
                color: `${colors.primary[600]}`,
              }}
            >
              Sale Date
            </th>
            <th
              style={{
                padding: "10px",
                border: `1px solid ${colors.primary[300]}`,
                color: `${colors.primary[600]}`,
              }}
            >
              Score
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
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {salesData.map((sale, index) => (
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
                {sale.agent?.agentID || "N/A"}
              </td>
              <td
                style={{
                  padding: "10px",
                  border: `1px solid ${colors.primary[300]}`,
                  color: `${colors.gray[100]}`,
                }}
              >
                {sale.agent?.fullName || "N/A"}
              </td>
              <td
                style={{
                  padding: "10px",
                  border: `1px solid ${colors.primary[300]}`,
                  color: `${colors.gray[100]}`,
                }}
              >
                {sale.form?.email || "N/A"}
              </td>
              <td
                style={{
                  padding: "10px",
                  border: `1px solid ${colors.primary[300]}`,
                  color: `${colors.gray[100]}`,
                }}
              >
                {sale.form?.phoneNumber || "N/A"}
              </td>
              <td
                style={{
                  padding: "10px",
                  border: `1px solid ${colors.primary[300]}`,
                  color: `${colors.gray[100]}`,
                }}
              >
                {sale.form?.address || "N/A"}
              </td>
              <td
                style={{
                  padding: "10px",
                  border: `1px solid ${colors.primary[300]}`,
                  color: `${colors.gray[100]}`,
                }}
              >
                {sale.form?.comments || "N/A"}
              </td>
              <td
                style={{
                  padding: "10px",
                  border: `1px solid ${colors.primary[300]}`,
                  color: `${colors.gray[100]}`,
                }}
              >
                {sale.campaign?.name || "N/A"}
              </td>
              <td
                style={{
                  padding: "10px",
                  border: `1px solid ${colors.primary[300]}`,
                  color: `${colors.gray[100]}`,
                }}
              >
                ${sale.amount !== undefined ? sale.amount.toFixed(2) : "N/A"}
              </td>
              <td
                style={{
                  padding: "10px",
                  border: `1px solid ${colors.primary[300]}`,
                  color: `${colors.gray[100]}`,
                }}
              >
                {sale.saleDate
                  ? new Date(sale.saleDate).toLocaleDateString()
                  : "N/A"}
              </td>
              <td
                style={{
                  padding: "10px",
                  border: `1px solid ${colors.primary[300]}`,
                  color: `${colors.gray[100]}`,
                }}
              >
                {sale.score || "N/A"}
              </td>
              <td
                style={{
                  padding: "10px",
                  border: `1px solid ${colors.primary[300]}`,
                  color: `${colors.gray[100]}`,
                }}
              >
                {sale.sentiment || "N/A"}
              </td>
              <td
                style={{
                  padding: "10px",
                  border: `1px solid ${colors.primary[300]}`,
                  color: `${colors.gray[100]}`,
                }}
              >
                <button
                  onClick={() => handleDelete(sale._id)}
                  style={{
                    padding: "5px 10px",
                    fontSize: "12px",
                    backgroundColor: colors.redAccent[600],
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

export default DownloadSalesReport;
