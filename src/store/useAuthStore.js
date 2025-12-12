import { create } from "zustand";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,

  /**
   * Initialize auth state from localStorage
   */
  initialize: () => {
    const token = localStorage.getItem("auth_token");
    const userStr = localStorage.getItem("auth_user");
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ token, user, isAuthenticated: true, loading: false });
      } catch {
        set({ token: null, user: null, isAuthenticated: false, loading: false });
      }
    } else {
      set({ token: null, user: null, isAuthenticated: false, loading: false });
    }
  },

  /**
   * Login - store token and user data
   * @param {string} token - JWT token
   * @param {Object} user - User data { user, com_id, role }
   */
  login: (token, user) => {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_user", JSON.stringify(user));
    set({ token, user, isAuthenticated: true, loading: false });
  },

  /**
   * Logout - clear token and user data
   */
  logout: () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    set({ token: null, user: null, isAuthenticated: false });
  },

  /**
   * Set user data
   */
  setUser: (user) => set({ user }),
}));