import React, { useState } from "react";
import { Box, Grid, Typography, Paper, Select, MenuItem, FormControl, InputLabel, Stack } from "@mui/material";
import StatsCard from "../components/dashboard/StatsCard";
import SimplePieChart from "../components/dashboard/SimplePieChart";
import SimpleBarChart from "../components/dashboard/SimpleBarChart";

// Icons
import PeopleIcon from "@mui/icons-material/People";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import MapIcon from "@mui/icons-material/Map";
import FilterListIcon from "@mui/icons-material/FilterList";

export default function Dashboard() {
  const [company, setCompany] = useState("all");
  const [province, setProvince] = useState("all");

  // Mock Data
  const stats = [
    {
      title: "Total Passengers",
      value: "420",
      change: "+8.1% from yesterday",
      changeType: "positive",
      icon: PeopleIcon,
      color: "#00C853", // Green
    },
    {
      title: "Total Revenue",
      value: "$12,600",
      change: "+12.3% from yesterday",
      changeType: "positive",
      icon: DirectionsBusIcon, // Using Bus icon for revenue context in this example
      color: "#2979FF", // Blue
    },
    {
      title: "Active Routes",
      value: "4",
      subtext: "Today",
      icon: MapIcon,
      color: "#AA00FF", // Purple
    },
  ];

  const pieData = [
    { label: "Cash", value: 57, color: "#00C853" },
    { label: "QR Code", value: 43, color: "#2979FF" },
  ];

  const barData = [
    { label: "Route A", value: 3500, color: "#FFA000" },
    { label: "Route B", value: 2500, color: "#FFA000" },
    { label: "Route C", value: 4500, color: "#FFA000" },
    { label: "Route D", value: 1800, color: "#FFA000" },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: "1.5rem", md: "2.125rem" } }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, fontSize: { xs: "0.875rem", md: "1rem" } }}>
          Today's overview of transactions and statistics
        </Typography>

        {/* Filters */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
            gap: 2,
            flexWrap: "wrap",
            borderRadius: 2
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1} sx={{ color: "text.secondary", mb: { xs: 1, sm: 0 } }}>
            <FilterListIcon />
            <Typography variant="body2">Filters:</Typography>
          </Stack>

          <FormControl size="small" sx={{ minWidth: 150, width: { xs: "100%", sm: "auto" } }}>
            <Select value={company} onChange={(e) => setCompany(e.target.value)} displayEmpty>
              <MenuItem value="all">All Companies</MenuItem>
              <MenuItem value="a">Company A</MenuItem>
              <MenuItem value="b">Company B</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150, width: { xs: "100%", sm: "auto" } }}>
            <Select value={province} onChange={(e) => setProvince(e.target.value)} displayEmpty>
              <MenuItem value="all">All Provinces</MenuItem>
              <MenuItem value="bk">Bangkok</MenuItem>
              <MenuItem value="cm">Chiang Mai</MenuItem>
            </Select>
          </FormControl>
        </Paper>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StatsCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {/* Left Chart: Pie */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, height: "100%" }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}>
              Transactions by Payment Method
            </Typography>
            <Box sx={{ mt: 4 }}>
              <SimplePieChart data={pieData} />
            </Box>
          </Paper>
        </Grid>

        {/* Right Chart: Bar */}
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, height: "100%" }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}>
              Revenue by Route
            </Typography>
            <SimpleBarChart data={barData} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
