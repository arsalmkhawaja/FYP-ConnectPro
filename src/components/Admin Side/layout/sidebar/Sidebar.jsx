import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  IconButton,
  Typography,
  useTheme,
  Button,
} from "@mui/material";
import { tokens } from "../../../../theme"; // Adjust path if necessary
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import {
  BarChartOutlined,
  DashboardOutlined,
  CampaignOutlined,
  MenuOutlined,
  PeopleAltOutlined,
  ReceiptOutlined,
  VerifiedOutlined,
  ExitToAppOutlined,
} from "@mui/icons-material";
import defaultAvatar from "../../../../assets/Circle CV Picture.png"; // Fallback avatar
import logo from "../../../../assets/logo name.jpg"; // Adjust path if necessary
import Item from "./Item";
import { ToggledContext } from "../AdminLayout";
import axios from "axios";
import { toast } from "react-toastify";

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null); // Initialize user state
  const { toggled, setToggled } = useContext(ToggledContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  // Fetch admin profile data when the component mounts
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("auth")) || "";
        if (token) {
          const response = await axios.get(
            "http://localhost:4000/api/v1/admin", // Adjusted to fetch specific admin
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const adminData = response.data.admin; // Access the admin object directly
          setUser(adminData); // Set user data
        } else {
          toast.warn("No token found");
        }
      } catch (error) {
        toast.error("Failed to load admin profile");
      }
    };

    fetchAdminProfile();
  }, []);

  const handleLogout = () => {
    try {
      // Remove the authentication token from localStorage
      localStorage.removeItem("auth");
      console.log("Token removed from localStorage");

      // Redirect the user to the login page
      navigate("/login");
      toast.info("Logged out successfully.");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <Sidebar
      backgroundColor={colors.primary[400]}
      rootStyles={{
        border: 0,
        height: "100%",
      }}
      collapsed={collapsed}
      onBackdropClick={() => setToggled(false)}
      toggled={toggled}
      breakPoint="md"
    >
      <Menu
        menuItemStyles={{
          button: { ":hover": { background: "transparent" } },
        }}
      >
        <MenuItem
          rootStyles={{
            margin: "10px 0 20px 0",
            color: colors.gray[100],
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {!collapsed && (
              <Box
                display="flex"
                alignItems="center"
                gap="12px"
                sx={{ transition: "all 0.3s ease" }}
              >
                <img
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "8px",
                  }}
                  src={logo}
                  alt="Logo"
                />
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  textTransform="capitalize"
                  color={colors.greenAccent[500]}
                >
                  Admin
                </Typography>
              </Box>
            )}
            <IconButton onClick={() => setCollapsed(!collapsed)}>
              <MenuOutlined />
            </IconButton>
          </Box>
        </MenuItem>
      </Menu>
      {!collapsed && user && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            mb: "25px",
          }}
        >
          <Avatar
            alt="avatar"
            src={
              user.profileImage
                ? `http://localhost:4000/${user.profileImage}`
                : defaultAvatar
            }
            sx={{ width: "100px", height: "100px" }}
          />
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h3" fontWeight="bold" color={colors.gray[100]}>
              {user.fullName || "Admin Name"}
            </Typography>
            <Typography
              variant="h6"
              fontWeight="500"
              color={colors.greenAccent[500]}
            >
              {user.position}{" "}
            </Typography>
          </Box>
        </Box>
      )}

      <Box mb={5} pl={collapsed ? undefined : "5%"}>
        <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: "#868dfb",
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
          <Item
            title="Dashboard"
            path="/dashboard" // Adjust path if necessary
            colors={colors}
            icon={<DashboardOutlined />}
          />
        </Menu>
        <Typography
          variant="h6"
          color={colors.gray[300]}
          sx={{ m: "15px 0 5px 20px" }}
        >
          {!collapsed ? "Management" : " "}
        </Typography>
        <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: "#868dfb",
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
          <Item
            title="Manage Agents"
            path="/agents"
            colors={colors}
            icon={<PeopleAltOutlined />}
          />
          <Item
            title="Manage Campaigns"
            path="/campaigns"
            colors={colors}
            icon={<CampaignOutlined />}
          />
          <Item
            title="Sales Reports"
            path="/sales-reports"
            colors={colors}
            icon={<ReceiptOutlined />}
          />
        </Menu>
        <Typography
          variant="h6"
          color={colors.gray[300]}
          sx={{ m: "15px 0 5px 20px" }}
        >
          {!collapsed ? "Pages" : " "}
        </Typography>
        <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: "#868dfb",
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
          <Item
            title="Analytics"
            path="/analytics"
            colors={colors}
            icon={<BarChartOutlined />}
          />
          <Item
            title="Quality Assurance"
            path="/qa"
            colors={colors}
            icon={<VerifiedOutlined />}
          />
        </Menu>
      </Box>

      {/* Logout button with icon and text when expanded, and icon only when collapsed */}
      <Box sx={{ mt: "auto", p: 2 }}>
        <Button
          variant="contained"
          onClick={handleLogout}
          fullWidth
          startIcon={<ExitToAppOutlined />}
          sx={{
            backgroundColor: colors.primary[100],
            color: colors.primary[500],
            ":hover": {
              backgroundColor: colors.primary[300],
            },
            justifyContent: collapsed ? "center" : "flex-start",
            padding: collapsed ? "8px" : "8px 16px",
            mt: collapsed ? 47.6 : 17.2,
            paddingLeft: collapsed ? "18px" : "65px",
            width: collapsed ? "35px" : "100%", // Adjust width in collapsed mode
            minWidth: collapsed ? "25px" : "auto", // Ensure the button doesn't shrink too much
            transition: "all 0.3s ease", // Smooth transition for all properties
          }}
        >
          {!collapsed && "Logout"}
        </Button>
      </Box>
    </Sidebar>
  );
};

export default SideBar;
