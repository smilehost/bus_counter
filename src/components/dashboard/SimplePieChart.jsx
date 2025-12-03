import React from "react";
import { Box, Typography, Stack } from "@mui/material";

export default function SimplePieChart({ data }) {
    // data: [{ label, value, color }]
    const total = data.reduce((acc, item) => acc + item.value, 0);

    let currentAngle = 0;
    const gradientParts = data.map((item) => {
        const percentage = (item.value / total) * 100;
        const endAngle = currentAngle + percentage;
        const str = `${item.color} ${currentAngle}% ${endAngle}%`;
        currentAngle = endAngle;
        return str;
    });

    const gradientString = `conic-gradient(${gradientParts.join(", ")})`;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
            <Box
                sx={{
                    width: 280, // Increased size
                    height: 280,
                    borderRadius: "50%",
                    background: gradientString,
                    position: "relative",
                    mb: 4,
                    maxWidth: "100%", // Responsive
                    aspectRatio: "1 / 1", // Maintain aspect ratio
                }}
            />

            <Stack direction="row" spacing={3} justifyContent="center" flexWrap="wrap">
                {data.map((item) => (
                    <Stack key={item.label} direction="row" alignItems="center" spacing={1}>
                        <Box sx={{ width: 12, height: 12, borderRadius: 0.5, bgcolor: item.color }} />
                        <Typography variant="body2" color="text.secondary">
                            {item.label}: {Math.round((item.value / total) * 100)}%
                        </Typography>
                    </Stack>
                ))}
            </Stack>
        </Box>
    );
}
