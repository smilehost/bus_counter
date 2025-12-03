import { useSnackbar } from "notistack";
import { useEffect } from "react"; // ✅ 1. เพิ่ม useEffect

let useSnackbarRef;

export const SnackbarUtilsConfigurator = () => {
  const snackbar = useSnackbar();

  // ✅ 2. ย้ายการกำหนดค่ามาไว้ใน useEffect (แก้ตัวแดง Cannot reassign...)
  useEffect(() => {
    useSnackbarRef = snackbar;
  }, [snackbar]);

  return null;
};

// ✅ 3. ใส่บรรทัดนี้เพื่อปิดการเตือนเรื่อง Fast Refresh
// eslint-disable-next-line react-refresh/only-export-components
export const toast = {
  success(msg, options = {}) {
    this.toast(msg, { ...options, variant: "success" });
  },
  warning(msg, options = {}) {
    this.toast(msg, { ...options, variant: "warning" });
  },
  info(msg, options = {}) {
    this.toast(msg, { ...options, variant: "info" });
  },
  error(msg, options = {}) {
    this.toast(msg, { ...options, variant: "error" });
  },
  toast(msg, options = {}) {
    if (useSnackbarRef) {
      useSnackbarRef.enqueueSnackbar(msg, options);
    } else {
      // ถ้ายังไม่พร้อม ให้เก็บลง console หรือรอ retry (optional)
      console.warn("Toast not ready yet, message:", msg);
    }
  },
};