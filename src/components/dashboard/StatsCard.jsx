import React from "react";
import { Paper, Box, Typography, Stack, Avatar } from "@mui/material";

export default function StatsCard({ title, value, change, changeType = "neutral", icon: Icon, color, subtext }) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 2, md: 3 },
                borderRadius: 2,
                height: "100%",
                display: "flex",
                alignItems: "center",
                gap: 2,
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
            }}
        >
            <Avatar
                variant="rounded"
                sx={{
                    bgcolor: color ? `${color}15` : "primary.light", // 15 = ~8% opacity
                    color: color || "primary.main",
                    width: { xs: 48, md: 56 },
                    height: { xs: 48, md: 56 },
                }}
            >
                {Icon && <Icon sx={{ fontSize: { xs: 24, md: 32 } }} />}
            </Avatar>

            <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: { xs: "0.75rem", md: "0.875rem" } }}>
                    {title}
                </Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ lineHeight: 1, fontSize: { xs: "1.5rem", md: "2.125rem" } }}>
                    {value}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                    {change && (
                        <Typography
                            variant="caption"
                            sx={{
                                color: changeType === "positive" ? "success.main" : changeType === "negative" ? "error.main" : "text.secondary",
                                fontWeight: "medium",
                                bgcolor: changeType === "positive" ? "#E8F5E9" : changeType === "negative" ? "#FFEBEE" : "transparent",
                                px: 0.5,
                                borderRadius: 0.5,
                                fontSize: { xs: "0.7rem", md: "0.75rem" }
                            }}
                        >
                            {change}
                        </Typography>
                    )}
                    {subtext && (
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: "0.7rem", md: "0.75rem" } }}>
                            {subtext}
                        </Typography>
                    )}
                </Stack>
            </Box>
        </Paper>
    );
}
