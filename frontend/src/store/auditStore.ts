import { create } from "zustand";
import { AuditRun } from "../types";
import { createAudit, getAudit, getAudits } from "../services/auditApi";

interface AuditState {
  audits: AuditRun[];
  currentAudit: AuditRun | null;
  loading: boolean;
  error: string | null;
  fetchAudits: () => Promise<void>;
  fetchAuditById: (id: number) => Promise<void>;
  runNewAudit: (url: string) => Promise<AuditRun>;
}

export const useAuditStore = create<AuditState>((set) => ({
  audits: [],
  currentAudit: null,
  loading: false,
  error: null,
  fetchAudits: async () => {
    set({ loading: true, error: null });
    try {
      const audits = await getAudits();
      set({ audits, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  fetchAuditById: async (id) => {
    set({ loading: true, error: null });
    try {
      const audit = await getAudit(id);
      set({ currentAudit: audit, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  runNewAudit: async (url) => {
    set({ loading: true, error: null });
    try {
      const audit = await createAudit(url);
      set((state) => ({ audits: [audit, ...state.audits], loading: false }));
      return audit;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },
}));
