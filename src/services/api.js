// src/services/api.js
import axios from "axios";
import { getToken, removeToken } from "./authService";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://192.168.1.221:3000/api/v1",
  timeout: 10000,
});

// Request interceptor - Add Bearer token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and 401 unauthorized
api.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);

    // If 401 Unauthorized, clear token and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
