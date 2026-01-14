import React from "react";
import { Button as MUIButton, CircularProgress } from "@mui/material";

/**
 * PRO CustomButton (Updated Gradient Design)
 * - ใช้สี Gradient ตามที่ระบุ (#1976D2 -> #64B5F6)
 */
export default function CustomButton({
  children,
  variant = "solid",
  color = "primary",
  size = "md",
  icon,
  iconRight,
  onlyIcon = false,
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  className,
  iconColor, // 🎨 เพิ่ม prop ใหม่สำหรับสีไอคอน
  ...props
}) {
  // 🎨 กำหนดสีหลักที่คุณต้องการ
  const PRIMARY_DEEP = "#1976D2"; // สีหลัก (เข้ม)
  const PRIMARY_LIGHT = "#64B5F6"; // สีรอง (สว่าง)

  const colorMap = {
    primary: PRIMARY_DEEP, // ใช้สีเข้มเป็นสีหลักสำหรับ Text/Border
    danger: "#D32F2F",
    success: "#2E7D32",
    gray: "#6B7280",
  };

  const mainColor = colorMap[color] || colorMap.primary;

  const sizeMap = {
    sm: { py: 0.6, px: 1.5, fontSize: "0.8rem", iconSize: 18 },
    // ปรับลดขนาดตัวอักษรลงจาก 0.95rem เป็น 0.9rem
    md: { py: 1, px: 2, fontSize: "0.875rem", iconSize: 20 },
    lg: { py: 1.2, px: 3, fontSize: "1.1rem", iconSize: 24 },
  };

  const selectedSize = sizeMap[size];

  // ==================================================
  // 🌈 Gradient Logic
  // ==================================================
  // ถ้าเป็น Primary ให้ใช้คู่สีที่กำหนด, ถ้าสีอื่นให้ใช้ฟังก์ชัน darken อัตโนมัติ
  const gradientBackground =
    color === "primary"
      ? `linear-gradient(135deg, ${PRIMARY_DEEP} 0%, ${PRIMARY_LIGHT} 100%)`
      : `linear-gradient(135deg, ${mainColor} 0%, ${darken(
          mainColor,
          0.2
        )} 100%)`;

  const hoverGradient =
    color === "primary"
      ? `linear-gradient(135deg, ${darken(
          PRIMARY_DEEP,
          0.1
        )} 0%, ${PRIMARY_DEEP} 100%)` // Hover แล้วเข้มขึ้นนิดหน่อย
      : `linear-gradient(135deg, ${darken(mainColor, 0.1)} 0%, ${darken(
          mainColor,
          0.3
        )} 100%)`;

  const variantStyle = {
    // 🔥 Solid: ใช้ Gradient ที่ปรับปรุงแล้ว
    solid: {
      background: gradientBackground,
      color: "#fff",
      boxShadow: `0px 3px 8px ${addAlpha(mainColor, 0.2)}`, // เงาสีเดียวกับปุ่ม
      border: "none",
      "&:hover": {
        background: hoverGradient,
        boxShadow: `0px 6px 16px ${addAlpha(mainColor, 0.5)}`,
      },
    },
    // ⚪ Outline: พื้นขาว ขอบสี
    // ⚪ Outline: พื้นขาว ขอบสีเทา ตัวหนังสือสีดำ
    outline: {
      border: `1.5px solid #BDBDBD`, // ขอบสีเทาอ่อน
      color: "#374151", // ตัวหนังสือสีดำ
      backgroundColor: "#fff",
      boxShadow: "0px 2px 5px rgba(0,0,0,0.05)",
      "&:hover": {
        backgroundColor: "#F5F5F5", // hover เทาอ่อน
        border: `1.5px solid #9E9E9E`, // hover ขอบเทาเข้มขึ้น
      },
    },

    // 👻 Ghost: ไม่มีพื้นหลัง
    ghost: {
      background: "transparent",
      border: "none",
      boxShadow: "none",
      color: iconColor,
      "&:hover": {
        background: addAlpha(mainColor, 0.08),
      },
      minWidth: 0,
      padding: onlyIcon ? selectedSize.py * 0.8 : selectedSize.py,
    },
    text: {
      color: mainColor,
      background: "transparent",
      "&:hover": { backgroundColor: addAlpha(mainColor, 0.08) },
    },
  };

  // ปรับ Padding ถ้าเป็นปุ่ม Icon อย่างเดียว
  const finalSx = {
    borderRadius: "10px", // ลดจาก 12px เป็น 10px
    textTransform: "none",
    fontWeight: 600,
    gap: "8px",
    transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)", // ปรับ transition ให้สมูทขึ้น
    ...selectedSize,
    ...(onlyIcon && {
      px: 0,
      py: 0,
      width: size === "lg" ? 48 : size === "md" ? 40 : 32,
      height: size === "lg" ? 48 : size === "md" ? 40 : 32,
      minWidth: 0,
    }),
    ...variantStyle[variant === "outline-icon" ? "outline" : variant],
  };

  // ==================================================
  // 🎨 Icon Color Logic
  // ==================================================
   const effectiveIconColor = iconColor
    ? iconColor // ถ้าผู้ใช้ส่งสีมา ให้ใช้เลย
    : variant === "solid"
    ? "#fff"
    : variant === "outline"
    ? "#374151"
    : mainColor;

const applyIconColor = (iconNode) => {
  if (!iconNode) return null;

  const isMuiIcon = iconNode.type?.muiName === "SvgIcon";

  if (isMuiIcon) {
    // MUI Icons
    return React.cloneElement(iconNode, {
      sx: {
        color: iconColor || effectiveIconColor,
        fontSize: selectedSize.iconSize,
        ...(iconNode.props.sx || {}),
      },
    });
  }

  // react-icons / phosphor-icons
  return React.cloneElement(iconNode, {
    color: iconColor || effectiveIconColor,
    size: selectedSize.iconSize,
    ...(iconNode.props || {}),
  });
};



  return (
    <MUIButton
      onClick={onClick}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      sx={finalSx}
      className={className}
      disableElevation
      {...props}
    >
      {loading && (
        <CircularProgress
          size={20}
          thickness={4}
          sx={{ color: variant === "solid" ? "#fff" : mainColor }}
        />
      )}

      {!loading && (
        <>
          {icon && applyIconColor(icon)}
          {!onlyIcon && children}
          {iconRight && applyIconColor(iconRight)}
        </>
      )}
    </MUIButton>
  );
}

// =======================
// 🛠 Utility Functions
// =======================

function darken(color, amount) {
  const clamp = (v) => Math.max(0, Math.min(255, v));
  const num = parseInt(color.replace("#", ""), 16);
  let r = clamp((num >> 16) - 255 * amount);
  let g = clamp(((num >> 8) & 0x00ff) - 255 * amount);
  let b = clamp((num & 0x0000ff) - 255 * amount);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function addAlpha(color, opacity) {
  const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
  return color + _opacity.toString(16).toUpperCase();
}