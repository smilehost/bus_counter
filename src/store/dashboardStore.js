import { create } from "zustand";
import { Users, Bus, Map } from "lucide-react";
import { getAllCounters } from "../services/counterService";

// --- Route Keys for each company ---
const COMPANY_ROUTES = {
  company_a: ["route_r1", "route_r3", "route_b1"],
  company_b: ["route_515", "route_140", "route_511", "route_29", "route_504"],
  company_c: ["route_kk_red", "route_kk_blue", "route_kk_songthaew8"],
};

// Helper function to generate random revenue data for routes
const generateRouteRevenue = (routes, baseValue = 2000) => {
  return routes.map(route => ({
    name: route,
    value: baseValue + Math.floor(Math.random() * 3000),
  }));
};

// --- Mock Data ---
const MOCK_DATA = {
  barChart: {
    all: [
      // Combine all routes
      ...generateRouteRevenue(COMPANY_ROUTES.company_a, 2500),
      ...generateRouteRevenue(COMPANY_ROUTES.company_b, 3000),
      ...generateRouteRevenue(COMPANY_ROUTES.company_c, 1800),
    ],
    company_a: generateRouteRevenue(COMPANY_ROUTES.company_a, 2500),
    company_b: generateRouteRevenue(COMPANY_ROUTES.company_b, 3000),
    company_c: generateRouteRevenue(COMPANY_ROUTES.company_c, 1800),
  },
  pieChart: {
    all: [
      { name: "Cash", value: 57, color: "#66BB6A" },
      { name: "QR Code", value: 43, color: "#64B5F6" },
    ],
    company_a: [
      { name: "Cash", value: 72, color: "#66BB6A" },
      { name: "QR Code", value: 28, color: "#64B5F6" },
    ],
    company_b: [
      { name: "Cash", value: 45, color: "#66BB6A" },
      { name: "QR Code", value: 55, color: "#64B5F6" },
    ],
    company_c: [
      { name: "Cash", value: 68, color: "#66BB6A" },
      { name: "QR Code", value: 32, color: "#64B5F6" },
    ],
  },
  stats: [
    {
      id: "passengers",
      translationKey: "dashboard.total_passengers",
      value: "1,856",
      change: "+8.1%",
      changeKey: "dashboard.from_yesterday",
      changeType: "positive",
      icon: Users,
      bgColor: "#66BB6A",
    },
    {
      id: "revenue",
      translationKey: "dashboard.total_revenue",
      value: "฿45,200",
      change: "+12.3%",
      changeKey: "dashboard.from_yesterday",
      changeType: "positive",
      icon: Bus,
      bgColor: "#1976D2",
    },
    {
      id: "routes",
      translationKey: "dashboard.active_routes",
      value: "11",
      changeKey: "dashboard.today",
      icon: Map,
      bgColor: "#AB47BC",
    },
  ],
  tableData: [
    // Chiang Mai routes
    { id: 1, route: "route_r1", company: "company_a", passengers: 156, revenue: "฿4,680", time: "08:30", status: "Completed" },
    { id: 2, route: "route_r3", company: "company_a", passengers: 89, revenue: "฿2,670", time: "09:15", status: "Completed" },
    { id: 3, route: "route_b1", company: "company_a", passengers: 124, revenue: "฿3,720", time: "10:00", status: "In Progress" },
    // Bangkok routes
    { id: 4, route: "route_515", company: "company_b", passengers: 245, revenue: "฿7,350", time: "07:00", status: "Completed" },
    { id: 5, route: "route_140", company: "company_b", passengers: 198, revenue: "฿5,940", time: "07:30", status: "Completed" },
    { id: 6, route: "route_511", company: "company_b", passengers: 312, revenue: "฿9,360", time: "08:00", status: "In Progress" },
    { id: 7, route: "route_29", company: "company_b", passengers: 267, revenue: "฿8,010", time: "08:30", status: "In Progress" },
    { id: 8, route: "route_504", company: "company_b", passengers: 189, revenue: "฿5,670", time: "09:00", status: "Scheduled" },
    // Khon Kaen routes
    { id: 9, route: "route_kk_red", company: "company_c", passengers: 78, revenue: "฿2,340", time: "08:00", status: "Completed" },
    { id: 10, route: "route_kk_blue", company: "company_c", passengers: 95, revenue: "฿2,850", time: "09:00", status: "In Progress" },
    { id: 11, route: "route_kk_songthaew8", company: "company_c", passengers: 45, revenue: "฿1,350", time: "10:00", status: "Scheduled" },
    { id: 12, route: "route_r1", company: "company_a", passengers: 134, revenue: "฿4,020", time: "11:00", status: "Scheduled" },
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
    busId: "all",
    chartType: "bar", // 'bar' | 'pie'
  },

  // 3. Dashboard Data
  data: {
    barChart: MOCK_DATA.barChart,
    pieChart: MOCK_DATA.pieChart,
    stats: MOCK_DATA.stats,
    transactions: MOCK_DATA.tableData,
  },

  // 4. Buses/Counters State
  buses: [],
  busesLoading: false,
  busesError: null,

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
      filters: { ...state.filters, company: "all", route: "all", busId: "all", dateRange: "today" }
    })),

  // Fetch buses/counters from API
  fetchBuses: async () => {
    set({ busesLoading: true, busesError: null });
    try {
      const response = await getAllCounters();
      const countersData = response.data || response;

      // Transform counter data to bus format
      const busesFromApi = countersData.map(counter => ({
        id: counter.counter_bus_id,
        counterId: counter.counter_id,
        lat: parseFloat(counter.counter_lat),
        lng: parseFloat(counter.counter_lng),
        passengers: counter.counter_in_count - counter.counter_out_count,
        inCount: counter.counter_in_count,
        outCount: counter.counter_out_count,
        cameraId: counter.counter_installed_camera_id,
        companyId: counter.counter_com_id, // Store raw company ID for filtering
        route: "route_r1", // Default route, can be updated when API provides route info
        status: "In Progress",
      }));

      set({ buses: busesFromApi, busesLoading: false });
    } catch (error) {
      console.error('Error fetching counters:', error);
      set({ busesError: error.message, busesLoading: false });
    }
  },

  // Selector: Get filtered buses
  getFilteredBuses: () => {
    const state = get();
    const { company, route, busId } = state.filters;

    return state.buses.filter(bus => {
      // Filter by company using companyId
      const companyMatch = company === "all" || bus.companyId === parseInt(company);
      const routeMatch = route === "all" || bus.route === route;
      const busIdMatch = busId === "all" || bus.id === parseInt(busId);
      return companyMatch && routeMatch && busIdMatch;
    });
  },

  // Get unique company IDs from buses
  getAvailableCompanies: () => {
    const state = get();
    const companyIds = [...new Set(state.buses.map(bus => bus.companyId))];
    return companyIds.sort((a, b) => a - b);
  },

  // Get unique bus IDs (filtered by current company/route)
  getAvailableBusIds: () => {
    const state = get();
    const { company, route } = state.filters;

    const filteredBuses = state.buses.filter(bus => {
      const companyMatch = company === "all" || bus.companyId === parseInt(company);
      const routeMatch = route === "all" || bus.route === route;
      return companyMatch && routeMatch;
    });

    return [...new Set(filteredBuses.map(bus => bus.id))].sort((a, b) => a - b);
  },

  // Selector: Get filtered transactions
  getFilteredTransactions: () => {
    const state = get();
    const { company, route } = state.filters;
    return state.data.transactions.filter(t => {
      const companyMatch = company === "all" || t.company === company;
      const routeMatch = route === "all" || t.route === route;
      return companyMatch && routeMatch;
    });
  },
}));