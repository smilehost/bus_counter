import React from "react";
import { SnackbarProvider } from "notistack";
import { SnackbarUtilsConfigurator } from "../utils/ToastUtils"; // Import ตัวที่เราสร้างเมื่อกี้
import { IconButton } from "@mui/material";
import { X } from "lucide-react"; // ใช้ Icon ปิดจาก Lucide

export const ToastProvider = ({ children }) => {
  // สร้าง Ref สำหรับปุ่มปิด (Close Button)
  const notistackRef = React.createRef();

  const onClickDismiss = (key) => () => {
    notistackRef.current.closeSnackbar(key);
  };

  return (
    <SnackbarProvider
      ref={notistackRef}
      maxSnack={3} // ✅ แสดงพร้อมกันได้สูงสุด 3 อัน (Enterprise ชอบจำกัดไว้กันรก)
      autoHideDuration={4000} // ปิดเองใน 4 วิ
      anchorOrigin={{ vertical: "top", horizontal: "right" }} // มุมขวาบน
      preventDuplicate // ป้องกันข้อความซ้ำกันเด้งรัวๆ
      
      // ✅ Custom Action: ปุ่มกากบาทปิด
      action={(key) => (
        <IconButton onClick={onClickDismiss(key)} size="small" sx={{ color: "white" }}>
          <X size={18} />
        </IconButton>
      )}

      // ✅ Styling: ปรับแต่งให้ดู Modern ขึ้น
      sx={{
        "& .SnackbarContent-root": {
          borderRadius: "8px",
          fontFamily: "inherit",
          fontWeight: 500,
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        },
      }}
    >
      {/* 👇 ตัวนี้สำคัญมาก! คือตัวเชื่อม API กับ Notistack */}
      <SnackbarUtilsConfigurator />
      
      {children}
    </SnackbarProvider>
  );
};