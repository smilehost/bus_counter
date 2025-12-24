// src/services/authService.js
import api from "./api";

/**
 * Login - just call the endpoint, backend returns mock token and user
 * No username/password needed for mock authentication
 * @returns {Promise<Object>} Response with token and user data
 */
export const login = async () => {
  const response = await api.post("/auth/login");
  // Backend returns { success: true, data: { token: "..." } }
  // User data is in the token payload: { user, com_id, role }
  return response.data;
};

/**
 * Login with OAuth callback
 * @param {string} code - Authorization code from OAuth provider
 * @param {string} sessionId - Session ID
 * @param {string} service - Service identifier
 * @returns {Promise<Object>} Response with access_token, username, refresh_token
 */
export const loginWithCallback = async (code, sessionId, service) => {
  const response = await api.post("/auth/login", {
    code,
    session_id: sessionId,
    service,
  });
  return response.data;
};

/**
 * Logout user
 */
export const logout = async () => {
  // For mock, we just clear local state
  // If backend has logout endpoint, call it here
};

/**
 * Get token from localStorage
 */
export const getToken = () => {
  return localStorage.getItem("auth_token");
};

/**
 * Set token in localStorage
 */
export const setToken = (token) => {
  localStorage.setItem("auth_token", token);
};

/**
 * Remove token from localStorage
 */
export const removeToken = () => {
  localStorage.removeItem("auth_token");
};

/**
 * Get refresh token from localStorage
 */
export const getRefreshToken = () => {
  return localStorage.getItem("refresh_token");
};

/**
 * Set refresh token in localStorage
 */
export const setRefreshToken = (token) => {
  localStorage.setItem("refresh_token", token);
};

/**
 * Remove refresh token from localStorage
 */
export const removeRefreshToken = () => {
  localStorage.removeItem("refresh_token");
};

export default {
  login,
  loginWithCallback,
  logout,
  getToken,
  setToken,
  removeToken,
  getRefreshToken,
  setRefreshToken,
  removeRefreshToken,
};
