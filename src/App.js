import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import AdminRegister from "./components/AdminRegister";
import Dashboard from "./components/Admin Side/Dashboard";
import Layout from "./components/Admin Side/layout/AdminLayout";
import UserManagement from "./components/Admin Side/UserManagement";
import CampaignDashboard from "./components/Admin Side/campaigndashboard";
import DownloadSalesReport from "./components/Admin Side/DownloadSalesReport";
import AgentAnalyticsDashboard from "./components/Admin Side/Analytics";
import AudioSentiment from "./components/Admin Side/QA";
import DialingScreen from "./components/Agent Side/Dialer";
import AgentHome from "./components/Agent Side/AgentHome";
import CallCenterScreen from "./components/Agent Side/Dialler2";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/adminregister" element={<AdminRegister />} />
        <Route path="/dialler" element={<DialingScreen />} />
        <Route path="/d" element={<CallCenterScreen />} />
        {/* Admin Dashboard */}
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
        </Route>
        <Route path="/agents" element={<Layout />}>
          <Route index element={<UserManagement />} />
        </Route>
        <Route path="/campaigns" element={<Layout />}>
          <Route index element={<CampaignDashboard />} />
        </Route>
        <Route path="/sales-reports" element={<Layout />}>
          <Route index element={<DownloadSalesReport />} />
        </Route>
        <Route path="/analytics" element={<Layout />}>
          <Route index element={<AgentAnalyticsDashboard />} />
        </Route>
        <Route path="/qa" element={<Layout />}>
          <Route index element={<AudioSentiment />} />
        </Route>
        {/* Agent Dialer */}
        <Route path="/dialer" element={<Layout />}>
          <Route index element={<CallCenterScreen />} />
        </Route>
        <Route path="/agent" element={<Layout />}>
          <Route index element={<AgentHome />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
