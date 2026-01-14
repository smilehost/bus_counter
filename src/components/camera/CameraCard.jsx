import React from "react";
import { Box, Typography, Paper, Avatar, Chip, Stack, IconButton } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { useTranslation } from 'react-i18next';

export default function CameraCard({ camera, onEdit, onDelete, onViewStats }) {
    const { t } = useTranslation();

    const getStatusColor = (status) => {
        switch (status) {
            case "active":
                return "#00C853";
            case "inactive":
                return "#F44336";
            case "warning":
                return "#FFA000";
            default:
                return "#9E9E9E";
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case "active":
                return t('manage_camera.active');
            case "inactive":
                return t('manage_camera.inactive');
            case "warning":
                return t('manage_camera.warning');
            default:
                return "Unknown";
        }
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 2,
                height: "100%",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.12)",
                },
            }}
        >
            {/* Camera Icon and Status */}
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                <Avatar
                    variant="rounded"
                    sx={{
                        bgcolor: `${getStatusColor(camera.status)}15`,
                        color: getStatusColor(camera.status),
                        width: 56,
                        height: 56,
                    }}
                >
                    <VideocamIcon sx={{ fontSize: 32 }} />
                </Avatar>
                <Chip
                    label={getStatusLabel(camera.status)}
                    size="small"
                    sx={{
                        bgcolor: `${getStatusColor(camera.status)}15`,
                        color: getStatusColor(camera.status),
                        fontWeight: "medium",
                        borderRadius: 1,
                    }}
                />
            </Stack>

            {/* Camera Info */}
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                {camera.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {camera.location}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                IP: {camera.ipAddress}
            </Typography>

            {/* Metrics */}
            <Stack direction="row" spacing={2} sx={{ mb: 2, py: 2, borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0" }}>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                        {t('manage_camera.today_count')}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                        {camera.todayCount}
                    </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                        {t('manage_camera.uptime')}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color={camera.uptime >= 95 ? "success.main" : "warning.main"}>
                        {camera.uptime}%
                    </Typography>
                </Box>
            </Stack>

            {/* Actions */}
            <Stack direction="row" spacing={1} justifyContent="flex-end">
                <IconButton size="small" onClick={() => onViewStats(camera)} sx={{ color: "primary.main" }}>
                    <AssessmentIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => onEdit(camera)} sx={{ color: "primary.main" }}>
                    <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => onDelete(camera)} sx={{ color: "error.main" }}>
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Stack>
        </Paper>
    );
}
