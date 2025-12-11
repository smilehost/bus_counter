import api from "./api";

const CameraService = {
    // Get installation by ID
    getInstallationById: async (id) => {
        try {
            const response = await api.get(`/camera/installation/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching installation ${id}:`, error);
            throw error;
        }
    },

    // Get all installation cameras
    getAllInstallationCameras: async () => {
        try {
            const response = await api.get("/cameras/installations");
            return response.data;
        } catch (error) {
            console.error("Error fetching all installation cameras:", error);
            throw error;
        }
    },
};

export default CameraService;
