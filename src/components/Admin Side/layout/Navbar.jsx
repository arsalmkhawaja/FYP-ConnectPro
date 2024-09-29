import React, { useContext } from "react";
import {
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { tokens, ColorModeContext } from "../../../theme";
import {
  DarkModeOutlined,
  LightModeOutlined,
  MenuOutlined,
  PersonOutlined,
} from "@mui/icons-material";
import { ToggledContext } from "./AdminLayout";
import "../styles/Navbar.css";

const Navbar = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const { toggled, setToggled } = useContext(ToggledContext);
  const isMdDevices = useMediaQuery("(max-width:768px)");
  const colors = tokens(theme.palette.mode);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      p={2}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        backgroundColor: theme.palette.background.default,
        // boxShadow: "0 2px 4px rgba(0,0,0,0.1)", // Removed the boxShadow
      }}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <IconButton
          sx={{ display: `${isMdDevices ? "flex" : "none"}` }}
          onClick={() => setToggled(!toggled)}
        >
          <MenuOutlined />
        </IconButton>
      </Box>

      <Box>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <LightModeOutlined />
          ) : (
            <DarkModeOutlined />
          )}
        </IconButton>
        <IconButton>
          <PersonOutlined />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Navbar;
