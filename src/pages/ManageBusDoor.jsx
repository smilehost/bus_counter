import React, { useState } from "react";
import ReusableModal from "../components/modal";
import { Box, Button, Typography } from "@mui/material";
import CustomButton from "../components/CustomButto";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import Trash from "@mui/icons-material/Autorenew";
import Settings from "@mui/icons-material/Autorenew";
import { convertDateFieldsToThai } from "../utils/dateUtils";

export default function ManageBusDoor() {
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState(null); // ⭐ เก็บข้อมูลที่ modal ส่งกลับมา

  const modalFields = [
    {
      type: "text-lang",
      name: "routeNameTH",
      label: "Route Name (Thai)",
      language: "TH",
      defaultValue: "",
    },
    {
      type: "text-lang",
      name: "routeNameEN",
      label: "Route Name (English)",
      language: "EN",
      defaultValue: "",
    },
    {
      type: "disabled",
      name: "productId",
      label: "Product ID",
      value: "PRD-001",
    },
    {
      type: "calendar",
      name: "releaseDate",
      label: "Release Date",
    },
    {
      type: "textarea",
      name: "description",
      label: "Description",
      rows: 3,
      maxLength: 200,
    },
    {
      type: "number",
      name: "quantity",
      label: "Quantity",
      min: 0,
      max: 999,
    },
    {
      type: "number",
      name: "number",
      label: "Optional Number",
    },
  ];

  return (
    <div className="text-xl">
      Manage Bus Door Assign Cameras / Doors / Sensors
      <Box sx={{ p: 4 }}>
        <CustomButton
          icon={<AutorenewIcon />}
          onClick={() => setOpenModal(true)}
        >
          Test Modal
        </CustomButton>
        <CustomButton>Test Modal</CustomButton>
        {/* ⭐ Reusable Modal */}
        <ReusableModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          title="Add New Product"
          fields={modalFields}
          confirmText="Save"
          onConfirm={(data) => {
            console.log("Modal Data:", data);
            setFormData(data); // ⭐ เก็บ data จาก modal
            setOpenModal(false);
          }}
        />

        {/* ⭐ แสดงผลข้อมูลที่ได้จาก modal */}
        {formData && (
          <Box
            sx={{ mt: 4, p: 2, border: "1px solid #ddd", borderRadius: "8px" }}
          >
            <Typography variant="h6">Saved Data</Typography>

            <pre
              style={{
                background: "#f8f8f8",
                padding: "12px",
                borderRadius: "8px",
              }}
            >
              {JSON.stringify(
                convertDateFieldsToThai(formData, ['releaseDate']),
                null,
                2
              )}
            </pre>
          </Box>
        )}
      </Box>
      <CustomButton variant="outline">View Details</CustomButton>
      <CustomButton variant="outline">Cancel</CustomButton>
      <CustomButton icon={<AutorenewIcon />} variant="outline">
        Cancel
      </CustomButton>
      <CustomButton
        variant="ghost"
        color="#FF4081"
        size="md"
        icon={<Settings />}
        onlyIcon={true}
        onClick={() => console.log("Icon button clicked")}
      />
      <CustomButton
        icon={<Settings />}
        iconColor="#FF4081" // 💗 สีอะไรก็ได้
        variant="ghost"
      ></CustomButton>
    </div>
  );
}
