// src/services/counterService.js
import api from "./api";

/**
 * Get all counters (bus positions)
 * @returns {Promise<Array>} List of counters with bus location data
 */
export const getAllCounters = async () => {
    const response = await api.get("/counters");
    return response.data;
};

/**
 * Get a specific counter by ID
 * @param {number} id - Counter ID
 * @returns {Promise<Object>} Counter data
 */
export const getCounter = async (id) => {
    const response = await api.get(`/counter/${id}`);
    return response.data;
};

export default {
    getAllCounters,
    getCounter,
};
