// layouts/MainLayout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import Sidebar from "../components/Sidebar";
import { useTranslation } from 'react-i18next';

// MUI Components
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  CssBaseline,
  Avatar,
  Stack,
  Button,
  ButtonGroup
} from "@mui/material";

// MUI Icons
import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 240;

const primaryColor = "#1976D2";  // สีน้ำเงินโทนกลาง (Material Blue) ดูสุภาพ
const secondaryColor = "#64B5F6"; // สีฟ้าที่สว่างขึ้นนิดเดียว (ไล่เฉดเนียนๆ ไม่กระโดด)

const getRoleName = (roleId) => {
  switch (roleId) {
    case 1:
      return "Admin";
    case 2:
      return "Staff";
    case 3:
      return "Viewer";
    default:
      return "User";
  }
};

export default function MainLayout() {
  const { user } = useAuthStore();
  const { t, i18n } = useTranslation();
  // 💡 สถานะสำหรับควบคุมการเปิด/ปิด Sidebar
  const [openSidebar, setOpenSidebar] = useState(false);

  // 💡 ฟังก์ชันสำหรับ Toggle สถานะ
  const handleDrawerToggle = () => {
    setOpenSidebar(!openSidebar);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
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
          background: '#ffffff',
          color: 'text.primary',
          boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow for white bar
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

          <Stack direction="row" spacing={{ xs: 1, sm: 2 }} alignItems="center">
            <Avatar
              sx={{
                background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                color: 'white',
                width: { xs: 32, sm: 40 }, // Smaller avatar on mobile
                height: { xs: 32, sm: 40 },
                fontSize: { xs: '0.875rem', sm: '1.25rem' }
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ textAlign: 'left' }}>
              <Typography
                variant="subtitle2"
                sx={{
                  lineHeight: 1.2,
                  maxWidth: { xs: 100, sm: 'none' }, // Limit width on mobile
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {user?.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  display: { xs: 'none', sm: 'block' }, // Hide role on mobile
                  lineHeight: 1
                }}
              >
                {getRoleName(user?.role)}
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ flexGrow: 1 }} />

          {/* Language Switcher */}
          <ButtonGroup variant="text" size="small" aria-label="language switcher">
            <Button
              onClick={() => changeLanguage('en')}
              sx={{
                color: i18n.language === 'en' ? primaryColor : 'text.secondary',
                fontWeight: i18n.language === 'en' ? 'bold' : 'normal',
                minWidth: 'auto',
                px: 1
              }}
            >
              EN
            </Button>
            <Button
              onClick={() => changeLanguage('th')}
              sx={{
                color: i18n.language === 'th' ? primaryColor : 'text.secondary',
                fontWeight: i18n.language === 'th' ? 'bold' : 'normal',
                minWidth: 'auto',
                px: 1
              }}
            >
              TH
            </Button>
          </ButtonGroup>
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
          p: { xs: 2, md: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` }, // Ensure it takes remaining space explicitly if needed, or just 100% of flex item
          mt: 8,
          overflowX: "hidden", // Prevent horizontal scroll
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}