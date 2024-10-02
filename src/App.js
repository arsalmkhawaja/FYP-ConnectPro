import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import AdminRegister from "./components/AdminRegister";
import Dashboard from "./components/Admin Side/Dashboard";
import Layout from "./components/Admin Side/layout/AdminLayout";
import AgentManagement from "./components/Admin Side/AgentManagement";
import CampaignDashboard from "./components/Admin Side/campaigndashboard";
import DownloadSalesReport from "./components/Admin Side/DownloadSalesReport";
import AgentAnalyticsDashboard from "./components/Admin Side/Analytics";
import ScriptViewer from "./components/Admin Side/ScriptViewerAdmin";
import AudioSentiment from "./components/Admin Side/QA";
import DialingScreen from "./components/Agent Side/Dialler";
import AgentHome from "./components/Agent Side/AgentHome";
import CallLogs from "./components/Agent Side/CallLogs";
import CallCenterScreen from "./components/Agent Side/Dialler";
import AgentLayout from "./components/Agent Side/AgentLayout/AgentLayout";
import AgentAnalytics from "./components/Agent Side/AgentAnalytics";
import ScriptViewerAgent from "./components/Agent Side/ScriptViewerAgent";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/adminregister" element={<AdminRegister />} />
        <Route path="/dialer" element={<DialingScreen />} />
        <Route path="/d" element={<CallCenterScreen />} />
        {/* Admin Dashboard */}
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
        </Route>
        <Route path="/agents" element={<Layout />}>
          <Route index element={<AgentManagement />} />
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
        <Route path="/scripts-admin" element={<Layout />}>
          <Route index element={<ScriptViewer />} />
        </Route>
        {/* Agent Dialer */}
        <Route path="/dialler" element={<AgentLayout />}>
          <Route index element={<CallCenterScreen />} />
        </Route>
        <Route path="/agent" element={<AgentLayout />}>
          <Route index element={<AgentHome loggedInAgent={"haris"} />} />
        </Route>
        <Route path="/agent-analytics" element={<AgentLayout />}>
          <Route index element={<AgentAnalytics loggedInAgent={"haris"} />} />
        </Route>
        <Route path="/call-logs" element={<AgentLayout />}>
          <Route index element={<CallLogs />} />
        </Route>
        <Route path="/scripts-agent" element={<AgentLayout />}>
          <Route index element={<ScriptViewerAgent />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
