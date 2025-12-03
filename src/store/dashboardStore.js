import { create } from "zustand";
import { Users, Bus, Map } from "lucide-react";

// --- Mock Data (ในงานจริงควรแยกไฟล์หรือดึงจาก API) ---
const MOCK_DATA = {
  barChart: {
    all: [
      { name: "Route A", value: 3500 },
      { name: "Route B", value: 2500 },
      { name: "Route C", value: 4500 },
      { name: "Route D", value: 1800 },
    ],
    company_a: [
      { name: "Route A", value: 2800 },
      { name: "Route B", value: 2100 },
      { name: "Route C", value: 3600 },
      { name: "Route D", value: 1500 },
    ],
    company_b: [
      { name: "Route A", value: 3200 },
      { name: "Route B", value: 1900 },
      { name: "Route C", value: 4100 },
      { name: "Route D", value: 1600 },
    ],
    company_c: [
      { name: "Route A", value: 3100 },
      { name: "Route B", value: 2300 },
      { name: "Route C", value: 4200 },
      { name: "Route D", value: 1700 },
    ],
  },
  pieChart: {
    all: [
      { name: "Cash", value: 57, color: "#66BB6A" },
      { name: "QR Code", value: 43, color: "#64B5F6" },
    ],
    company_a: [
      { name: "Cash", value: 65, color: "#66BB6A" },
      { name: "QR Code", value: 35, color: "#64B5F6" },
    ],
    company_b: [
      { name: "Cash", value: 48, color: "#66BB6A" },
      { name: "QR Code", value: 52, color: "#64B5F6" },
    ],
    company_c: [
      { name: "Cash", value: 60, color: "#66BB6A" },
      { name: "QR Code", value: 40, color: "#64B5F6" },
    ],
  },
  stats: [
    {
      id: "passengers",
      translationKey: "dashboard.total_passengers",
      value: "420",
      change: "+8.1%",
      changeKey: "dashboard.from_yesterday",
      changeType: "positive",
      icon: Users,
      bgColor: "#66BB6A",
    },
    {
      id: "revenue",
      translationKey: "dashboard.total_revenue",
      value: "$12,600",
      change: "+12.3%",
      changeKey: "dashboard.from_yesterday",
      changeType: "positive",
      icon: Bus,
      bgColor: "#1976D2",
    },
    {
      id: "routes",
      translationKey: "dashboard.active_routes",
      value: "4",
      changeKey: "dashboard.today",
      icon: Map,
      bgColor: "#AB47BC",
    },
  ],
  tableData: [
    { id: 1, route: "Route A", passengers: 245, revenue: "$3,500", time: "08:30 AM", status: "Completed" },
    { id: 2, route: "Route B", passengers: 198, revenue: "$2,500", time: "09:15 AM", status: "Completed" },
    { id: 3, route: "Route C", passengers: 312, revenue: "$4,500", time: "10:00 AM", status: "Completed" },
    { id: 4, route: "Route D", passengers: 156, revenue: "$1,800", time: "10:45 AM", status: "Completed" },
    { id: 5, route: "Route A", passengers: 223, revenue: "$3,200", time: "11:30 AM", status: "In Progress" },
    { id: 6, route: "Route B", passengers: 189, revenue: "$2,400", time: "12:15 PM", status: "In Progress" },
    { id: 7, route: "Route C", passengers: 267, revenue: "$4,100", time: "01:00 PM", status: "Scheduled" },
    { id: 8, route: "Route D", passengers: 145, revenue: "$1,700", time: "01:45 PM", status: "Scheduled" },
    { id: 9, route: "Route A", passengers: 234, revenue: "$3,300", time: "02:30 PM", status: "Scheduled" },
    { id: 10, route: "Route B", passengers: 201, revenue: "$2,600", time: "03:15 PM", status: "Scheduled" },
    { id: 11, route: "Route C", passengers: 289, revenue: "$4,300", time: "04:00 PM", status: "Scheduled" },
    { id: 12, route: "Route D", passengers: 167, revenue: "$1,900", time: "04:45 PM", status: "Scheduled" },
  ],
};

// --- Store Implementation ---
export const useDashboardStore = create((set, get) => ({
  // 1. Auth & User State
  user: { id: 1, name: "SmileXD", role: 1 },
  
  // 2. Dashboard UI Filters
  filters: {
    company: "all",
    dateRange: "today",
    route: "all",
    chartType: "bar", // 'bar' | 'pie'
  },

  // 3. Dashboard Data
  data: {
    barChart: MOCK_DATA.barChart,
    pieChart: MOCK_DATA.pieChart,
    stats: MOCK_DATA.stats,
    transactions: MOCK_DATA.tableData,
  },

  // --- Actions ---
  
  // User Actions
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),

  // Filter Actions
  setFilter: (key, value) => 
    set((state) => ({
      filters: { ...state.filters, [key]: value }
    })),
  
  resetFilters: () => 
    set((state) => ({
      filters: { ...state.filters, company: "all", route: "all", dateRange: "today" }
    })),

  // Data Selectors/Getters (Logic การกรองข้อมูลย้ายมาคำนวณที่นี่ หรือเรียกใช้ใน Component ก็ได้)
  // เพื่อความง่ายในการอ่าน Component เราจะดึง Raw Data ไปกรองที่ Component หรือสร้าง Selector
}));