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

/**
 * Get counters by specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Array>} List of counters
 */
export const getCountersByDate = async (date) => {
    const response = await api.get(`/counters/by-date`, { params: { date } });
    return response.data;
};

/**
 * Get counters by date range
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {Promise<Array>} List of counters
 */
export const getCountersByDateRange = async (startDate, endDate) => {
    const response = await api.get(`/counters/by-date-range`, { params: { startDate, endDate } });
    return response.data;
};

export default {
    getAllCounters,
    getCounter,
    getCountersByDate,
    getCountersByDateRange,
};
