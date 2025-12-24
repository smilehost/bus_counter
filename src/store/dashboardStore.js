import { create } from "zustand";
import { Users, Bus, Map } from "lucide-react";
import { getAllCounters, getCountersByDate, getCountersByDateRange } from "../services/counterService";

// Helper to format date as YYYY-MM-DD
const formatDate = (dateString) => {
  if (!dateString) return null;
  if (dateString.includes('T')) {
    return dateString.split('T')[0];
  }
  return dateString;
};

// --- Store Implementation ---
export const useDashboardStore = create((set, get) => ({
  // 1. Auth & User State
  user: { id: 1, name: "SmileXD", role: 1 },

  // 2. Dashboard UI Filters
  filters: {
    company: "all", // Default to all companies
    dateRange: "all",
    customStartDate: new Date().toISOString().split('T')[0],
    customEndDate: new Date().toISOString().split('T')[0],
    route: "all",
    busId: "all",
    chartType: "bar", // 'bar' | 'pie'
  },

  // 3. Dashboard Data
  data: {
    barChart: { all: [] },
    pieChart: { all: [] },
    stats: [
      {
        id: "passengers",
        translationKey: "dashboard.total_passengers",
        value: "0",
        changeKey: "dashboard.from_yesterday", // Context might change with real data
        changeType: "neutral",
        icon: Users,
        bgColor: "#66BB6A",
      },
      {
        id: "active_buses", // Changed from revenue
        translationKey: "dashboard.active_buses", // Need key for this or reuse
        value: "0",
        changeKey: "dashboard.today",
        changeType: "neutral",
        icon: Bus,
        bgColor: "#1976D2",
      },
      {
        id: "routes",
        translationKey: "dashboard.active_routes",
        value: "0",
        changeKey: "dashboard.today",
        icon: Map,
        bgColor: "#AB47BC",
      },
    ],
    transactions: [],
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
      filters: { ...state.filters, company: "all", route: "all", busId: "all", dateRange: "all" }
    })),

  // Fetch buses/counters from API
  fetchBuses: async () => {
    set({ busesLoading: true, busesError: null });
    const { filters } = get();

    try {
      let response;
      const formattedStartDate = formatDate(filters.customStartDate);
      const formattedEndDate = formatDate(filters.customEndDate);

      if (filters.dateRange === 'single_day' && formattedStartDate) {
        response = await getCountersByDate(formattedStartDate);
      } else if ((filters.dateRange === 'custom' || filters.dateRange === 'today' || filters.dateRange === 'yesterday') && formattedStartDate && formattedEndDate) {
        // If start == end, treat as single day
        if (formattedStartDate === formattedEndDate) {
          response = await getCountersByDate(formattedStartDate);
        } else {
          response = await getCountersByDateRange(formattedStartDate, formattedEndDate);
        }
      } else {
        response = await getAllCounters();
      }

      const countersData = response.data || response;

      // Transform counter data to bus format
      const busesFromApi = countersData.map(counter => ({
        id: counter.counter_bus_id,
        counterId: counter.counter_id,
        lat: parseFloat(counter.counter_lat),
        lng: parseFloat(counter.counter_lng),
        passengers: Math.max(0, counter.counter_in_count - counter.counter_out_count), // Ensure non-negative
        inCount: counter.counter_in_count,
        outCount: counter.counter_out_count,
        cameraId: counter.counter_installed_camera_id,
        companyId: counter.counter_com_id,
        route: "Unknown", // Placeholder as route is missing
        status: counter.counter_active ? "In Progress" : "Completed", // Infer status
      }));

      // --- Calculate Derived Data ---

      // 1. Stats
      const totalPassengers = busesFromApi.reduce((sum, bus) => sum + bus.inCount, 0); // Using Total In as "Total Passengers"
      const activeBuses = busesFromApi.length;
      // const activeRoutes = new Set(busesFromApi.map(b => b.route)).size; // meaningless without route data

      const newStats = [
        {
          id: "passengers",
          translationKey: "dashboard.total_passengers",
          value: totalPassengers.toLocaleString(),
          change: "", // No history to diff against yet
          changeKey: "dashboard.today",
          changeType: "neutral",
          icon: Users,
          bgColor: "#66BB6A",
        },
        {
          id: "active_buses",
          translationKey: "dashboard.bus", // Use generic "Bus" or "Active Buses"
          value: activeBuses.toString(),
          change: "",
          changeKey: "dashboard.today",
          changeType: "neutral",
          icon: Bus,
          bgColor: "#1976D2",
        },
        // Reusing 3rd card for something else or keeping it simple
        {
          id: "cameras",
          translationKey: "table.camera", // Reusing camera translation
          value: new Set(busesFromApi.map(b => b.cameraId)).size.toString(),
          changeKey: "dashboard.today",
          icon: Map,
          bgColor: "#AB47BC",
        },
      ];

      // 2. Bar Chart: Passengers by Company
      // Since we don't have company names in this service, we use IDs or hardcoded names if we had them.
      // Assuming 1, 2, 3 from previous file.
      const companyNames = {
        1: "Chiang Mai",
        2: "Bangkok",
        3: "Khon Kaen"
      };

      const companyStats = busesFromApi.reduce((acc, bus) => {
        const id = bus.companyId;
        const name = companyNames[id] || `Company ${id}`;
        if (!acc[id]) acc[id] = { name: name, value: 0 };
        acc[id].value += bus.inCount;
        return acc;
      }, {});

      const barChartData = Object.values(companyStats);

      // 3. Transactions (Table Data) - Just use the buses list
      const transactions = busesFromApi;

      set({
        buses: busesFromApi,
        data: {
          barChart: { all: barChartData }, // Simplified structure
          pieChart: { all: [] }, // Empty for now
          stats: newStats,
          transactions: transactions,
        },
        busesLoading: false
      });
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
    const { company } = state.filters; // Only filter by company for table usually
    return state.data.transactions.filter(t => {
      const companyMatch = company === "all" || t.companyId === parseInt(company);
      return companyMatch;
    });
  },
}));