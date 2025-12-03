// components/Sidebar.jsx
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
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
  {
    label: "Manage Camera",
    path: "/manage-camera",
    icon: CameraAltIcon,
    roles: [1, 2],
  },
  {
    label: "Manage Bus Door",
    path: "/manage-busdoor",
    icon: DirectionsBusIcon,
    roles: [1, 2],
  },
];

export default function Sidebar({ role, open, onClose }) {
  // 🎨 กำหนดชุดสีฟ้าแบบเรียบง่าย สบายตา (Modern Blue)
  const primaryColor = "#1976D2"; // สีน้ำเงินโทนกลาง
  const secondaryColor = "#64B5F6"; // สีฟ้าสว่างขึ้น (สำหรับ Gradient)
  const shadowColor = "rgba(25, 118, 210, 0.25)"; // เงาสีฟ้าจางๆ

  const location = useLocation();
  const safeRole = role ?? 0;
  const theme = useTheme();
  // 💡 ตรวจสอบว่าหน้าจอเป็นขนาดเล็กกว่า md หรือไม่ (คือ Mobile)
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const filteredMenus = menus.filter((item) => item.roles.includes(safeRole));

  const drawerContent = (
    <Box
      sx={{
        width: drawerWidth,
        height: "100%",        // ✅ ให้เต็มความสูง
        display: "flex",       // ✅ จัด layout แบบ flex
        flexDirection: "column",
        overflowX: "hidden",   // ✅✅ บรรทัดนี้สำคัญที่สุด! ช่วยซ่อนแถบเลื่อนด้านล่าง
      }}
      role="presentation"
    >
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Bus Counter
        </Typography>
      </Toolbar>
      <Divider />
     <List sx={{ flexGrow: 1 }}>
        {filteredMenus.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={RouterLink}
                to={item.path}
                onClick={isMobile ? onClose : undefined}
                selected={isActive}
                sx={{
                  borderRadius: "12px",
                  mx: 1,
                  my: 0.5,
                  transition: "all 0.3s ease", // เพิ่ม transition ให้นุ่มนวล

                  // 🎨 สีปกติ (ตอนยังไม่เลือก)
                  color: "black",
                  "&:hover": {
                     bgcolor: "rgba(25, 118, 210, 0.08)", // ฟ้าจางๆ ตอน hover
                     color: primaryColor,
                     "& .MuiListItemIcon-root": {
                        color: primaryColor,
                     }
                  },

                  // 🎨 ส่วน ICON
                  "& .MuiListItemIcon-root": {
                    minWidth: "32px",
                    color: isActive ? "white" : "black",
                    transition: "color 0.3s",
                  },

                  // 🌟 ไฮไลท์ตอนเลือก (Active State) - ไล่สีฟ้า
                  "&.Mui-selected": {
                    // ไล่สี Gradient แบบเฉียงๆ (สีฟ้าโทนเรียบ)
                    background: `linear-gradient(45deg, ${primaryColor} 30%, ${secondaryColor} 90%)`,
                    color: "white",
                    fontWeight: "bold",
                    
                    // เงาฟุ้งๆ สีฟ้า (Drop Shadow)
                    boxShadow: `0px 4px 12px ${shadowColor}`,

                    "&:hover": {
                      // ตอนชี้เมาส์ย้ำ ให้สีเข้มขึ้นนิดนึง
                      background: `linear-gradient(45deg, ${primaryColor} 50%, ${secondaryColor} 100%)`,
                    },
                  },
                }}
              >
                <ListItemIcon>
                  <item.icon />
                </ListItemIcon>
                <ListItemText 
                    primary={item.label} 
                    primaryTypographyProps={{ 
                        fontSize: '0.95rem', 
                        fontWeight: isActive ? 'bold' : 'normal' ,
                        noWrap: true // ✅ ป้องกันข้อความยาวเกินแล้วดันกล่องจนล้น
                    }} 
                />
              </ListItemButton>
            </ListItem>
          );
        })}
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
            overflowX: "hidden", // ✅ กันเหนียวที่ตัว Drawer ด้วย
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
            overflowX: "hidden", // ✅ กันเหนียวที่ตัว Drawer ด้วย
          },
        }}
        open // ไม่จำเป็นต้องใช้ prop นี้ แต่ใส่ไว้เพื่อความชัดเจนว่าเปิดอยู่เสมอ
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
