// components/Sidebar.jsx
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
  Box,
  Toolbar, // 💡 แก้ไข: ต้อง Import Toolbar
} from "@mui/material";

// MUI Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";

const drawerWidth = 240;

const menus = [
  { label: "Dashboard", path: "/", icon: DashboardIcon, roles: [1, 2, 3] },
  { label: "Manage Camera", path: "/manage-camera", icon: CameraAltIcon, roles: [1, 2] },
  { label: "Manage Bus Door", path: "/manage-busdoor", icon: DirectionsBusIcon, roles: [1, 2] },
];

export default function Sidebar({ role, open, onClose }) {
  const safeRole = role ?? 0;
  const theme = useTheme();
  // 💡 ตรวจสอบว่าหน้าจอเป็นขนาดเล็กกว่า md หรือไม่ (คือ Mobile)
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const filteredMenus = menus.filter((item) => item.roles.includes(safeRole));

  const drawerContent = (
    <Box sx={{ width: drawerWidth }} role="presentation">
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Bus Counter
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {filteredMenus.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              // 💡 เมื่ออยู่บนมือถือ ให้ปิด Sidebar หลังคลิกเมนู
              onClick={isMobile ? onClose : undefined} 
            >
              <ListItemIcon>
                <item.icon />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      {/* 1. Mobile Drawer (Temporary - เปิด/ปิดได้) */}
      <Drawer
        variant="temporary" // 💡 โหมดเปิด/ปิดได้
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, 
        }}
        sx={{
          display: { xs: "block", md: "none" }, // 💡 แสดงเฉพาะจอเล็ก (xs)
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* 2. Desktop Drawer (Permanent - เปิดอยู่ตลอด) */}
      <Drawer
        variant="permanent" // 💡 โหมดเปิดอยู่ตลอด
        sx={{
          display: { xs: "none", md: "block" }, // 💡 แสดงเฉพาะจอใหญ่ (md ขึ้นไป)
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
        open // ไม่จำเป็นต้องใช้ prop นี้ แต่ใส่ไว้เพื่อความชัดเจนว่าเปิดอยู่เสมอ
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}