// src/store/routeStore.js
import { create } from 'zustand';
import { RouteService } from '@/services/route.service';

export const useRouteStore = create((set) => ({
  routeData: {
    data: [],
    page: 1,
    size: 10,
    total: 0,
    totalPages: 0
  },
  allRoutes: [],
  isLoading: false,

  setRouteData: (newData) => set({ routeData: newData }),

  addRoute: async (newRoute) => {
    try {
      const payload = {
        route_name_th: newRoute.route_name_th,
        route_name_en: newRoute.route_name_en,
        route_color: newRoute.route_color,
        route_status: Number(newRoute.route_status),
        route_com_id: Number(newRoute.route_com_id),
        route_array: newRoute.route_array,
        price_1: newRoute.price_1,
        price_2: newRoute.price_2,
        price_3: newRoute.price_3,
        price_4: newRoute.price_4
      };

      await RouteService.createRoute(payload);
      return { success: true };

    } catch (error) {
      console.error("create route error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error"
      };
    }
  },

  updateRoute: async (id, updatedRoute) => {
    try {
      const payload = {
        route_id: Number(id),
        route_name_th: updatedRoute.route_name_th,
        route_name_en: updatedRoute.route_name_en,
        route_color: updatedRoute.route_color,
        route_status: Number(updatedRoute.route_status),
        route_com_id: Number(updatedRoute.route_com_id),
        route_array: updatedRoute.route_array,
        price_1: updatedRoute.price_1,
        price_2: updatedRoute.price_2,
        price_3: updatedRoute.price_3,
        price_4: updatedRoute.price_4
      };

      await RouteService.updateRoute(id, payload);
      return { success: true };

    } catch (error) {
      console.error("updateRoute error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error"
      };
    }
  },

  updateRouteStatus: async (id, status) => {
    try {
      const payload = { route_status: status };
      await RouteService.updateRouteStatus(id, payload);
      return { success: true };
    } catch (error) {
      console.error("updateRouteStatus error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error"
      };
    }
  },

  deleteRoute: async (id) => {
    try {
      await RouteService.deleteRoute(id);
      return { success: true };
    } catch (error) {
      console.error("delete route error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error"
      };
    }
  },

  getRoutes: async (page, size, search = "", status = "") => {
    try {
      const res = await RouteService.fetchRoutes({ page, size, search, status });
      set({ routeData: res.result });
    } catch (error) {
      console.error("getRoutes error:", error);
      set({
        routeData: {
          data: [],
          page: 1,
          size: 10,
          total: 0,
          totalPages: 0
        },
      });
    }
  },

  getRouteById: async (id) => {
    try {
      const res = await RouteService.getRouteById(id);
      return res.result;
    } catch (error) {
      console.error("getRouteById error:", error);
      return undefined;
    }
  },

  fetchAllRoutes: async () => {
    set({ isLoading: true });
    try {
      const res = await RouteService.getAllRoutes();
      set({ allRoutes: res.result });
    } catch (error) {
      console.error("fetchAllRoutes error:", error);
      set({ allRoutes: [] });
    } finally {
      set({ isLoading: false });
    }
  }
}));
