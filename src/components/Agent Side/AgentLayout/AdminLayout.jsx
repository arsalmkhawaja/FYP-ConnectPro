import React, { useState } from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../../theme";
import Navbar from "./Navbar";
import SideBar from "./sidebar/Sidebar"; // Import the SideBar component
import { Outlet } from "react-router-dom";

export const ToggledContext = React.createContext(null); // Export the context

const AdminLayout = () => {
  const [theme, colorMode] = useMode();
  const [toggled, setToggled] = useState(false);
  const values = { toggled, setToggled };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToggledContext.Provider value={values}>
          <Box sx={{ display: "flex", height: "100vh", maxWidth: "100%" }}>
            <SideBar /> {/* Include the SideBar */}
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                maxWidth: "100%",
              }}
            >
              {/* Navbar positioned fixed and content with margin */}
              <Navbar />
              <Box
                sx={{
                  overflowY: "auto",
                  flex: 1,
                  maxWidth: "100%",
                  mt: '60px', // This ensures the content below the navbar
                }}
              >
                <Outlet />
              </Box>
            </Box>
          </Box>
        </ToggledContext.Provider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default AdminLayout;
