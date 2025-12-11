// components/Sidebar.jsx
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useTranslation } from 'react-i18next';
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
  Toolbar,
} from "@mui/material";

// MUI Icons
import { LayoutDashboard, Camera, Bus, LogOut, LogIn, Home } from "lucide-react";

const drawerWidth = 240;

const menus = [
  { label: "sidebar.dashboard", path: "/", icon: LayoutDashboard, roles: [1, 2, 3] },
  {
    label: "sidebar.manage_camera",
    path: "/manage-camera",
    icon: Camera,
    roles: [1, 2],
  },
  {
    label: "sidebar.manage_busdoor",
    path: "/manage-busdoor",
    icon: Bus,
    roles: [1, 2],
  },
  {
    label: "Login Page",
    path: "/login",
    icon: LogIn,
    roles: [1, 2, 3],
  },
  {
    label: "Landing Page",
    path: "/landing",
    icon: Home,
    roles: [1, 2, 3],
  },
];

export default function Sidebar({ role, open, onClose }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const primaryColor = "#1976D2";
  const secondaryColor = "#64B5F6";
  const shadowColor = "rgba(25, 118, 210, 0.25)";

  const location = useLocation();
  const safeRole = role ?? 0;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const filteredMenus = menus.filter((item) => item.roles.includes(safeRole));

  const drawerContent = (
    <Box
      sx={{
        width: drawerWidth,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
      role="presentation"
    >
      {/* Header (Logo) */}
      <Toolbar
        sx={{
          minHeight: { xs: 56, sm: 64 },
          px: { xs: 3.2, sm: 3.5 },
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Box
          sx={{
            width: { xs: 28, sm: 32 },
            height: { xs: 28, sm: 32 },
            borderRadius: 2,
            background: `linear-gradient(45deg, ${primaryColor} 30%, ${secondaryColor} 90%)`,
            mr: { xs: 1, sm: 1.5 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            flexShrink: 0,
          }}
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#333",
            fontSize: { xs: "1rem", sm: "1.25rem" },
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          {t('app.title')}
        </Typography>
      </Toolbar>

      <Divider />

      {/* Menu List */}
      <List
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          overflowX: "hidden",
          px: { xs: 1, sm: 1 },
          py: 1,
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(0,0,0,0.2)",
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "rgba(0,0,0,0.3)",
          },
        }}
      >
        {filteredMenus.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={RouterLink}
                to={item.path}
                onClick={isMobile ? onClose : undefined}
                selected={isActive}
                sx={{
                  borderRadius: "12px",
                  minHeight: { xs: 44, sm: 48 },
                  px: { xs: 1.5, sm: 2 },
                  py: { xs: 1, sm: 1.25 },
                  transition: "all 0.3s ease",
                  color: "black",

                  "&:hover": {
                    bgcolor: "rgba(25, 118, 210, 0.08)",
                    color: primaryColor,
                    "& .MuiListItemIcon-root": {
                      color: primaryColor,
                    },
                  },

                  "& .MuiListItemIcon-root": {
                    minWidth: { xs: 36, sm: 40 },
                    color: isActive ? "white" : "black",
                    transition: "color 0.3s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  },

                  "&.Mui-selected": {
                    background: `linear-gradient(45deg, ${primaryColor} 30%, ${secondaryColor} 90%)`,
                    color: "white",
                    fontWeight: "bold",
                    boxShadow: `0px 4px 12px ${shadowColor}`,

                    "&:hover": {
                      background: `linear-gradient(45deg, ${primaryColor} 50%, ${secondaryColor} 100%)`,
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    "& svg": {
                      width: { xs: 20, sm: 24 },
                      height: { xs: 20, sm: 24 },
                    },
                  }}
                >
                  <item.icon />
                </ListItemIcon>
                <ListItemText
                  primary={t(item.label)}
                  primaryTypographyProps={{
                    fontSize: { xs: "0.875rem", sm: "0.95rem" },
                    fontWeight: isActive ? "bold" : "normal",
                    noWrap: true,
                    sx: {
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
        <ListItemButton
          onClick={() => {
            logout();
            navigate("/login");
          }}
          sx={{
            borderRadius: "12px",
            minHeight: { xs: 44, sm: 48 },
            px: { xs: 2, sm: 3 },
            py: { xs: 1, sm: 1.25 },
            width: "fit-content",
            display: "flex",
            alignItems: "center",
            transition: "all 0.3s ease",
            color: "#ef4444",
            "&:hover": {
              bgcolor: "rgba(239, 68, 68, 0.08)",
              color: "#dc2626",
              "& .MuiListItemIcon-root": {
                color: "#dc2626",
              },
            },
            "& .MuiListItemIcon-root": {
              minWidth: "auto",
              mr: 1.5,
              color: "#ef4444",
              transition: "color 0.3s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
          }}
        >
          <ListItemIcon
            sx={{
              "& svg": {
                width: { xs: 20, sm: 24 },
                height: { xs: 20, sm: 24 },
              },
            }}
          >
            <LogOut />
          </ListItemIcon>
          <ListItemText
            primary={t('sidebar.logout')}
            primaryTypographyProps={{
              fontSize: { xs: "0.875rem", sm: "0.95rem" },
              fontWeight: "medium",
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { md: drawerWidth },
        flexShrink: { md: 0 },
      }}
    >
      {/* Mobile Drawer (Temporary) */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            overflow: "hidden",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer (Permanent) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            overflow: "hidden",
            borderRight: "none",
            boxShadow: "4px 0px 20px rgba(0, 0, 0, 0.08)",
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}