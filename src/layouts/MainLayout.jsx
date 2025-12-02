// layouts/MainLayout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import Sidebar from "../components/Sidebar";

// MUI Components
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  CssBaseline,
} from "@mui/material";

// MUI Icons
import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 240;

export default function MainLayout() {
  const { user } = useAuthStore();
  // 💡 สถานะสำหรับควบคุมการเปิด/ปิด Sidebar
  const [openSidebar, setOpenSidebar] = useState(false);

  // 💡 ฟังก์ชันสำหรับ Toggle สถานะ
  const handleDrawerToggle = () => {
    setOpenSidebar(!openSidebar);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      
      {/* AppBar (Top Bar) */}
      <AppBar
        position="fixed"
        sx={{
          // กำหนดความกว้างของ AppBar ให้หดลงเมื่ออยู่บนจอ Desktop
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          {/* Toggle button: แสดงเฉพาะบนจอเล็ก (md: "none") */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle} // เรียกฟังก์ชัน Toggle
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div">
            Bus Counter Admin
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Sidebar
        role={user?.role}
        open={openSidebar} // ส่งสถานะปัจจุบัน
        onClose={handleDrawerToggle} // ส่งฟังก์ชัน toggle สำหรับปิดเมื่อคลิกที่ Overlay
      />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}