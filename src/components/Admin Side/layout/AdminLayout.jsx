import React, { useState } from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../../../theme";
import Navbar from "./Navbar";
import SideBar from "./sidebar/Sidebar";
import { Outlet } from "react-router-dom";

export const ToggledContext = React.createContext(null);

const AdminLayout = () => {
  const [theme, colorMode] = useMode();
  const [toggled, setToggled] = useState(false);
  const values = { toggled, setToggled };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToggledContext.Provider value={values}>
          <Box sx={{ position: "relative", height: "100vh", width: "100vw" }}>
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1,
              }}
            >
              <Navbar />
            </Box>
            <Box sx={{ display: "flex", height: "100%", width: "100%" }}>
              <Box sx={{ zIndex: 2, position: "relative" }}>
                <SideBar />
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  maxWidth: "100%",
                }}
              >
                <Box
                  sx={{
                    overflowY: "auto",
                    flex: 1,
                    maxWidth: "100%",
                    mt: "60px",
                  }}
                >
                  <Outlet />
                </Box>
              </Box>
            </Box>
          </Box>
        </ToggledContext.Provider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default AdminLayout;
