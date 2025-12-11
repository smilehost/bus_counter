import { create } from "zustand";
import CameraService from "../services/cameraService";

export const useCameraStore = create((set, get) => ({
    // State
    cameras: [], // Stores list of installation cameras
    selectedCamera: null,
    loading: false,
    error: null,

    // Actions
    fetchCameras: async () => {
        set({ loading: true, error: null });
        try {
            const response = await CameraService.getAllInstallationCameras();
            // Handle response structure { success: true, data: [...] }
            const camerasData = response.data || response;
            set({ cameras: Array.isArray(camerasData) ? camerasData : [], loading: false });
        } catch (error) {
            console.error("Store: Failed to fetch installation cameras", error);
            set({ error: "Failed to load installation cameras", loading: false });
        }
    },

    getCameraInfo: async (id) => {
        set({ loading: true, error: null });
        try {
            const data = await CameraService.getInstallationById(id);
            set({ selectedCamera: data, loading: false });
            return data;
        } catch (error) {
            console.error(`Store: Failed to fetch installation camera ${id}`, error);
            set({ error: `Failed to load installation camera ${id}`, loading: false });
            throw error;
        }
    },

    clearSelectedCamera: () => set({ selectedCamera: null }),
}));
