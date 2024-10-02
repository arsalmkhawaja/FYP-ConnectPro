import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DownloadOutlined, PersonAdd, PointOfSale } from "@mui/icons-material";
import { toast } from "react-toastify";
import StatBox from "./components/StatBox";
import LineChart from "./components/LineChart";
import BarChart from "./components/BarChart";
import ProgressCircle from "./components/ProgressCircle";
import { tokens } from "../../theme";
import "./styles/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("auth")) || "";
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    if (!token) {
      toast.warn("Please login first to access the dashboard");
      navigate("/login");
    }
  }, [token, navigate]);

  const handleLogout = () => {
    try {
      localStorage.removeItem("auth");
      navigate("/login");
      toast.info("Logged out successfully.");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  const isXlDevices = useMediaQuery("(min-width: 1260px)");
  const isMdDevices = useMediaQuery("(min-width: 724px)");
  const isXsDevices = useMediaQuery("(max-width: 436px)");

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h3" color={colors.primary[100]}>
          DASHBOARD
        </Typography>
      </Box>

      {/* Grid Layout */}
      <Box m="20px">
        <Box
          display="grid"
          gridTemplateColumns={
            isXlDevices
              ? "repeat(12, 1fr)"
              : isMdDevices
              ? "repeat(6, 1fr)"
              : "repeat(3, 1fr)"
          }
          gridAutoRows="140px"
          gap="20px"
        >
          <Box
            gridColumn="span 6"
            bgcolor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title="431,225"
              subtitle="Sales Obtained"
              progress="0.50"
              increase="+21%"
              icon={
                <PointOfSale
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          </Box>
          <Box
            gridColumn="span 6"
            bgcolor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title="32,441"
              subtitle="New Clients"
              progress="0.30"
              increase="+5%"
              icon={
                <PersonAdd
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          </Box>

          <Box
            gridColumn={
              isXlDevices ? "span 12" : isMdDevices ? "span 8" : "span 6"
            }
            gridRow="span 2"
            bgcolor={colors.primary[400]}
          >
            <Box
              mt="25px"
              px="30px"
              display="flex"
              justifyContent="space-between"
            >
              <Box>
                <Typography
                  variant="h5"
                  fontWeight="600"
                  color={colors.gray[100]}
                >
                  Revenue Generated
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color={colors.greenAccent[500]}
                >
                  $59,342.32
                </Typography>
              </Box>
            </Box>
            <Box height="250px" mt="-20px">
              <LineChart isDashboard={true} />
            </Box>
          </Box>

          <Box
            gridColumn={isXlDevices ? "span 6" : "span 6"}
            gridRow="span 2"
            bgcolor={colors.primary[400]}
          >
            <Typography
              variant="h5"
              fontWeight="600"
              sx={{ p: "30px 30px 0 30px" }}
            >
              Sales Quantity
            </Typography>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="250px"
              mt="-20px"
            >
              <BarChart isDashboard={true} />
            </Box>
          </Box>

          <Box
            gridColumn={isXlDevices ? "span 6" : "span 6"}
            gridRow="span 2"
            bgcolor={colors.primary[400]}
            p="30px"
          >
            <Typography variant="h5" fontWeight="600">
              Campaign
            </Typography>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mt="25px"
            >
              <ProgressCircle size="125" />
              <Typography
                textAlign="center"
                variant="h5"
                color={colors.greenAccent[500]}
                sx={{ mt: "15px" }}
              >
                $48,352 revenue generated
              </Typography>
              <Typography textAlign="center">
                Includes extra misc expenditures and costs
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
