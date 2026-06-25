import { create } from "zustand";
import { DashboardSummary } from "../types";
import { getDashboardSummary } from "../services/dashboardApi";

interface DashboardState {
  summary: DashboardSummary | null;
  loading: boolean;
  error: string | null;
  fetchSummary: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  summary: null,
  loading: false,
  error: null,
  fetchSummary: async () => {
    set({ loading: true, error: null });
    try {
      const summary = await getDashboardSummary();
      set({ summary, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
}));
