import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: { id: 1, name: "SmileXD", role: 1 }, // Default mock

  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
