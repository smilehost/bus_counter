import React, { useState } from "react";
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
  TextField,
} from "@mui/material";
import { X } from "lucide-react";
import ThaiDatePicker from './dashboard/ThaiDatePicker';

// Transition Effect
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// ============================================
// Input Components สำหรับแต่ละ Type
// ============================================

const TextInputWithLanguage = ({ value, onChange, label, language = "EN" }) => {
  // Regular expressions สำหรับแต่ละภาษา
  const languagePatterns = {
    TH: /^[\u0E00-\u0E7F\s]*$/, // ภาษาไทย + ช่องว่าง
    EN: /^[a-zA-Z\s]*$/,         // ภาษาอังกฤษ + ช่องว่าง
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const pattern = languagePatterns[language] || /^.*$/; // Default: allow all

    // ตรวจสอบว่าตรงกับภาษาที่กำหนดหรือไม่
    if (pattern.test(inputValue)) {
      onChange(inputValue);
    }
    // ถ้าไม่ตรง ไม่ทำอะไร (ป้องกันการพิมพ์)
  };

  const placeholders = {
    TH: "พิมพ์ภาษาไทยเท่านั้น",
    EN: "Type in English only",
  };

  return (
    <div>
      <label className="block text-xs text-gray-600 mb-1">
        {label} <span className="text-blue-500">({language})</span>
      </label>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholders[language] || `Enter ${label} (${language})`}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />
    </div>
  );
};

// 2. Disabled Input (ป้องกันการแก้ไข)
const DisabledInput = ({ value, label }) => {
  return (
    <Box>
      <Typography variant="caption" sx={{ color: "#6b7280", mb: 0.5, display: "block" }}>
        {label}
      </Typography>
      <TextField
        fullWidth
        value={value}
        disabled
        variant="outlined"
        size="small"
        sx={{
          borderRadius: "8px",
          "& .MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor: "#9ca3af",
            cursor: "not-allowed",
          },
        }}
      />
    </Box>
  );
};

// 3. Calendar Input - ใช้ ThaiDatePicker
const CalendarInput = ({ value, onChange, label }) => {
  return (
    <div>
      <ThaiDatePicker
        value={value}
        onChange={onChange}
        min="2000-01-01"
        max="2099-12-31"
        label={label}
      />
    </div>
  );
};

// 4. Textarea
const TextareaInput = ({ value, onChange, label, rows = 4, maxLength }) => {
  return (
    <Box>
      <Typography variant="caption" sx={{ color: "#6b7280", mb: 0.5, display: "block" }}>
        {label}
        {maxLength && (
          <span style={{ float: "right", color: "#9ca3af" }}>
            {value?.length || 0}/{maxLength}
          </span>
        )}
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={rows}
        value={value}
        onChange={(e) => {
          const newValue = e.target.value;
          if (!maxLength || newValue.length <= maxLength) {
            onChange(newValue);
          }
        }}
        placeholder={`Enter ${label}...`}
        variant="outlined"
        sx={{ borderRadius: "8px" }}
      />
    </Box>
  );
};

// 5. Number Input (ฐาน 10, ห้ามติดลบ, จำกัดค่าได้)
const NumberInput = ({ value, onChange, label, min = 0, max, step = 1 }) => {
  const handleChange = (e) => {
    const inputValue = e.target.value;

    // อนุญาตเฉพาะตัวเลขฐาน 10
    if (inputValue === "" || /^\d+$/.test(inputValue)) {
      const numValue = inputValue === "" ? "" : parseInt(inputValue, 10);

      // ตรวจสอบ min และ max
      if (numValue === "" || (numValue >= min && (!max || numValue <= max))) {
        onChange(numValue);
      }
    }
  };

  return (
    <Box>
      <Typography variant="caption" sx={{ color: "#6b7280", mb: 0.5, display: "block" }}>
        {label} {max && `(Max: ${max})`}
      </Typography>
      <TextField
        fullWidth
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={`Enter ${label}`}
        variant="outlined"
        size="small"
        inputProps={{
          inputMode: "numeric",
          pattern: "[0-9]*",
          min,
          max,
          step,
        }}
        sx={{ borderRadius: "8px" }}
      />
    </Box>
  );
};

// ============================================
// Main Modal Component
// ============================================
export default function ReusableModal({
  open,
  onClose,
  title,
  fields = [], // Array of field configs
  confirmText = "Confirm",
  onConfirm,
  variant = "info",
}) {
  const [formData, setFormData] = useState({});

  // Update field value
  const handleFieldChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  // Handle confirm
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(formData);
    }
  };

  // Render input based on type
  const renderField = (field) => {
    const value = formData[field.name] || field.defaultValue || "";

    switch (field.type) {
      case "text-lang":
        return (
          <TextInputWithLanguage
            key={field.name}
            label={field.label}
            value={value}
            onChange={(val) => handleFieldChange(field.name, val)}
            language={field.language}
          />
        );

      case "disabled":
        return (
          <DisabledInput
            key={field.name}
            label={field.label}
            value={field.value}
          />
        );

      case "calendar":
        return (
          <CalendarInput
            key={field.name}
            label={field.label}
            value={value}
            onChange={(val) => handleFieldChange(field.name, val)}
          />
        );

      case "textarea":
        return (
          <TextareaInput
            key={field.name}
            label={field.label}
            value={value}
            onChange={(val) => handleFieldChange(field.name, val)}
            rows={field.rows}
            maxLength={field.maxLength}
          />
        );

      case "number":
        return (
          <NumberInput
            key={field.name}
            label={field.label}
            value={value}
            onChange={(val) => handleFieldChange(field.name, val)}
            min={field.min}
            max={field.max}
            step={field.step}
          />
        );

      case "warning":
        return (
          <Box
            key={field.name}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: field.variant === "danger" ? "#FEE2E2" : "#FEF3C7",
              border: `1px solid ${field.variant === "danger" ? "#FECACA" : "#FDE68A"}`,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: field.variant === "danger" ? "#991B1B" : "#92400E",
                fontWeight: 500,
                display: "flex",
                alignItems: "flex-start",
                gap: 1,
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>{field.icon || "⚠️"}</span>
              {field.message}
            </Typography>
          </Box>
        );

      case "info":
        return (
          <Box key={field.name} sx={{ py: 1 }}>
            <Typography variant="caption" sx={{ color: "#6b7280", display: "block", mb: 0.5 }}>
              {field.label}
            </Typography>
            <Typography variant="body1" sx={{ color: "#374151", fontWeight: 500 }}>
              {field.value}
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  const isDanger = variant === "danger";
  const mainColor = isDanger ? "#d32f2f" : "#1976D2";

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "16px",
          width: "100%",
          maxWidth: "500px",
          padding: 1,
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: 600, color: "#374151" }}>
          {title}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: "#9ca3af" }}>
          <X size={20} />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 1 }}>
          {fields.map((field) => renderField(field))}
        </Box>
      </DialogContent>

      {/* Actions */}
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

        {onConfirm && (
          <Button
            onClick={handleConfirm}
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
            {confirmText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
