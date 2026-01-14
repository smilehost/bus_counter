import React from "react";
import { Box, Typography, Stack } from "@mui/material";

export default function SimpleBarChart({ data }) {
    // data: [{ label, value, color }]
    const maxValue = Math.max(...data.map((d) => d.value));

    return (
        <Box sx={{ width: "100%", height: 350, display: "flex", alignItems: "flex-end", gap: 2, pt: 4 }}>
            {/* Y-axis labels (Simplified) */}
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", pr: 1 }}>
                <Typography variant="caption" color="text.secondary">{maxValue}</Typography>
                <Typography variant="caption" color="text.secondary">{Math.round(maxValue / 2)}</Typography>
                <Typography variant="caption" color="text.secondary">0</Typography>
            </Box>

            {/* Bars */}
            <Box sx={{ flexGrow: 1, display: "flex", alignItems: "flex-end", justifyContent: "space-around", height: "100%", borderLeft: "1px dashed #e0e0e0", borderBottom: "1px dashed #e0e0e0" }}>
                {data.map((item) => (
                    <Box key={item.label} sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                        <Box
                            sx={{
                                width: "40%",
                                height: `${(item.value / maxValue) * 100}%`,
                                bgcolor: item.color || "primary.main",
                                borderRadius: "4px 4px 0 0",
                                transition: "height 0.5s ease",
                                minHeight: 4, // Ensure visibility even if 0
                                position: "relative",
                                "&:hover": { opacity: 0.8 }
                            }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                            {item.label}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
