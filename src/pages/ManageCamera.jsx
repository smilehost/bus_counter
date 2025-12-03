import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Stack,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CameraCard from "../components/camera/CameraCard";

export default function ManageCamera() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock camera data
  const cameras = [
    {
      id: 1,
      name: "Camera 001",
      location: "Bus #123 - Front Door",
      status: "active",
      ipAddress: "192.168.1.101",
      todayCount: 245,
      uptime: 99.5,
    },
    {
      id: 2,
      name: "Camera 002",
      location: "Bus #123 - Rear Door",
      status: "active",
      ipAddress: "192.168.1.102",
      todayCount: 198,
      uptime: 98.2,
    },
    {
      id: 3,
      name: "Camera 003",
      location: "Bus #456 - Front Door",
      status: "warning",
      ipAddress: "192.168.1.103",
      todayCount: 156,
      uptime: 87.3,
    },
    {
      id: 4,
      name: "Camera 004",
      location: "Bus #456 - Rear Door",
      status: "inactive",
      ipAddress: "192.168.1.104",
      todayCount: 0,
      uptime: 0,
    },
    {
      id: 5,
      name: "Camera 005",
      location: "Bus #789 - Front Door",
      status: "active",
      ipAddress: "192.168.1.105",
      todayCount: 312,
      uptime: 99.8,
    },
    {
      id: 6,
      name: "Camera 006",
      location: "Bus #789 - Middle Door",
      status: "active",
      ipAddress: "192.168.1.106",
      todayCount: 278,
      uptime: 96.4,
    },
  ];

  const handleAddCamera = () => {
    console.log("Add camera clicked");
    // TODO: Open add camera dialog
  };

  const handleEditCamera = (camera) => {
    console.log("Edit camera:", camera);
    // TODO: Open edit camera dialog
  };

  const handleDeleteCamera = (camera) => {
    console.log("Delete camera:", camera);
    // TODO: Show confirmation dialog
  };

  const handleViewStats = (camera) => {
    console.log("View stats:", camera);
    // TODO: Navigate to camera stats page or show dialog
  };

  const filteredCameras = cameras.filter(
    (camera) =>
      camera.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camera.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ maxWidth: "100%" }}>
      {/* Header */}
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: "1.5rem", md: "2.125rem" } }}>
              Manage Cameras
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
              Configure and monitor cameras for passenger counting
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddCamera}
            sx={{
              bgcolor: "primary.main",
              "&:hover": { bgcolor: "primary.dark" },
              textTransform: "none",
              px: 3,
              py: 1,
            }}
          >
            Add Camera
          </Button>
        </Stack>

        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Search cameras by name or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            maxWidth: { xs: "100%", md: 500 },
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              bgcolor: "background.paper",
            },
          }}
        />
      </Box>

      {/* Camera Grid */}
      {filteredCameras.length > 0 ? (
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {filteredCameras.map((camera) => (
            <Grid item xs={12} sm={6} md={4} key={camera.id}>
              <CameraCard
                camera={camera}
                onEdit={handleEditCamera}
                onDelete={handleDeleteCamera}
                onViewStats={handleViewStats}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 2,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No cameras found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchQuery
              ? "Try adjusting your search query"
              : "Get started by adding your first camera"}
          </Typography>
          {!searchQuery && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddCamera}
              sx={{ textTransform: "none" }}
            >
              Add Your First Camera
            </Button>
          )}
        </Paper>
      )}
    </Box>
  );
}
