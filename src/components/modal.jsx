import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  Slide,
} from "@mui/material";
import { X } from "lucide-react"; // ใช้ไอคอนจาก Lucide

// เอฟเฟกต์เลื่อนขึ้นตอนเปิด (Transition)
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function modal({
  open, // (Boolean) เปิดหรือปิด
  onClose, // (Func) ฟังก์ชันปิด Popup
  title, // (String) หัวข้อ
  children, // (Node) เนื้อหาข้างใน (Input หรือ Text)
  confirmText, // (String) ข้อความปุ่มยืนยัน (เช่น "บันทึก", "ลบ")
  onConfirm, // (Func) ฟังก์ชันเมื่อกดปุ่มยืนยัน
  variant = "info", // (String) รูปแบบสี: "info" (สีฟ้า), "danger" (สีแดง)
}) {
  // กำหนดสีปุ่มตาม Variant
  const isDanger = variant === "danger";
  const mainColor = isDanger ? "#d32f2f" : "#1976D2";

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      aria-describedby="alert-dialog-slide-description"
      // ปรับแต่งความกว้างและความมน
      PaperProps={{
        sx: {
          borderRadius: "16px",
          width: "100%",
          maxWidth: "450px", // ความกว้างสูงสุด
          padding: 1,
        },
      }}
    >
      {/* --- ส่วนหัว (Title) --- */}
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography 
            variant="h6" 
            component="div"  // ✅✅ เพิ่มบรรทัดนี้ครับ!
            sx={{ fontWeight: 600, color: "#374151" }}
        >
          {title}
        </Typography>
        {/* ปุ่มกากบาทปิดมุมขวา */}
        <IconButton onClick={onClose} size="small" sx={{ color: "#9ca3af" }}>
          <X size={20} />
        </IconButton>
      </DialogTitle>

      {/* --- ส่วนเนื้อหา (Content) --- */}
      <DialogContent>
        <Box sx={{ color: "#4b5563", mt: 1 }}>{children}</Box>
      </DialogContent>

      {/* --- ส่วนปุ่มกด (Actions) --- */}
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            color: "#6b7280",
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 500,
            mr: 1,
          }}
        >
          Cancel
        </Button>

        {/* ปุ่มยืนยัน (จะแสดงก็ต่อเมื่อมีการส่ง onConfirm มา) */}
        {onConfirm && (
          <Button
            onClick={onConfirm}
            variant="contained"
            sx={{
              bgcolor: mainColor,
              borderRadius: "8px",
              textTransform: "none",
              boxShadow: "none",
              fontWeight: 600,
              "&:hover": {
                bgcolor: isDanger ? "#b71c1c" : "#1565c0",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              },
            }}
          >
            {confirmText || "Confirm"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
