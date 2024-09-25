import React, { useEffect } from "react";
import * as XLSX from "xlsx";
import agentsdata from "../../assets/agentsdata.json";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const DownloadSalesReport = () => {
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("auth")) || "";
  useEffect(() => {
    // Check if token exists and redirect if not
    if (!token) {
      toast.warn("Please login first to access the dashboard");
      navigate("/login");
    }
  }, [token, navigate]);

  const handleDownload = () => {
    const data = [
      [
        "Agent",
        "Title",
        "First Name",
        "Middle Name",
        "Last Name",
        "Email",
        "Phone",
        "Alt Phone",
        "Address",
        "City",
        "State",
        "Postcode",
        "Province",
        "Vendor ID",
        "Dial Code",
        "Gender",
        "Comments",
        "Product",
        "Amount",
        "Sale Date",
        "Campaign Name",
        "Total Campaign Sales",
      ],
    ];

    Object.keys(agentsdata).forEach((agent) => {
      const agentData = agentsdata[agent];
      const sales = agentData.salesComparative.values;
      const campaignSales = agentData.comparativeCampaignSales.values;

      sales.forEach((sale) => {
        const customer = sale.customer;
        data.push([
          agentData.agentName,
          customer.title,
          customer.firstName,
          customer.middleName,
          customer.lastName,
          customer.email,
          customer.phone,
          customer.altPhone,
          customer.address,
          customer.city,
          customer.state,
          customer.postcode,
          customer.province,
          customer.vendorID,
          customer.dialCode,
          customer.gender,
          customer.comments,
          sale.product,
          sale.amount,
          sale.date,
          campaignSales.length ? campaignSales[0].campaignName : "",
          campaignSales.length ? campaignSales[0].totalSales.toFixed(2) : "",
        ]);
      });
    });

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report");
    XLSX.writeFile(workbook, "SalesReport.xlsx");
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>Sales Report</h1>
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
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Agent</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>
              First Name
            </th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Email</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Phone</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>
              Address
            </th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>
              Comments
            </th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>
              Product
            </th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>
              Amount
            </th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>
              Sale Date
            </th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>
              Campaign Name
            </th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>
              Total Campaign Sales
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(agentsdata).map((agent) => {
            const agentData = agentsdata[agent];
            return agentData.salesComparative.values.map((sale, index) => {
              const customer = sale.customer;
              return (
                <tr key={`${agent}-${index}`}>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {agentData.agentName}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {customer.firstName}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {customer.email}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {customer.phone}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {customer.address}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {customer.comments}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {sale.product}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    ${sale.amount.toFixed(2)}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {sale.date}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {agentData.comparativeCampaignSales.values.length
                      ? agentData.comparativeCampaignSales.values[0]
                          .campaignName
                      : ""}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {agentData.comparativeCampaignSales.values.length
                      ? `$${agentData.comparativeCampaignSales.values[0].totalSales.toFixed(
                          2
                        )}`
                      : ""}
                  </td>
                </tr>
              );
            });
          })}
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
    </div>
  );
};

export default DownloadSalesReport;
