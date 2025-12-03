import { useSnackbar } from "notistack";
import React from "react";

// เก็บ function enqueueSnackbar ไว้ในตัวแปรธรรมดา
let useSnackbarRef;

// Component นี้มีหน้าที่แค่ "ขโมย" hook มาเก็บไว้ในตัวแปรข้างบน
export const SnackbarUtilsConfigurator = () => {
  useSnackbarRef = useSnackbar();
  return null;
};

// Export object นี้ออกไปใช้งาน (แทนการใช้ triggerToast เดิม)
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
      console.warn("SnackbarUtils not initialized yet.");
    }
  },
};