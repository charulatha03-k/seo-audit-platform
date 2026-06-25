import os

files = {
    'frontend/services/apiClient.ts': '''import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
''',
    'frontend/types/index.ts': '''export interface Website {
  id: number;
  url: string;
  created_at: string;
}

export interface Metric {
  id: number;
  audit_id: number;
  lcp: number | null;
  cls_metric: number | null;
  inp: number | null;
  fcp: number | null;
  ttfb: number | null;
}

export interface Issue {
  id: number;
  audit_id: number;
  severity: "critical" | "high" | "medium" | "low";
  category: "seo" | "performance" | "accessibility" | "compatibility";
  title: string;
  description: string;
  recommendation?: string;
}

export interface Recommendation {
  id: number;
  audit_id: number;
  title: string;
  recommendation: string;
  priority: "high" | "medium" | "low";
  impact: "high" | "medium" | "low";
}

export interface AuditRun {
  id: number;
  website_id: number;
  audit_date: string;
  status: "pending" | "running" | "completed" | "failed";
  seo_score: number | null;
  performance_score: number | null;
  accessibility_score: number | null;
  compatibility_score: number | null;
  overall_score: number | null;
  issue_count: number;
  metrics?: Metric;
  issues: Issue[];
  recommendations: Recommendation[];
}

export interface DashboardSummary {
  total_audits: number;
  average_seo_score: number;
  average_performance_score: number;
  average_accessibility_score: number;
  average_compatibility_score: number;
  recent_audits: AuditRun[];
  issues_by_severity: Record<string, number>;
  score_trends: { date: string; score: number }[];
}
''',
    'frontend/services/auditApi.ts': '''import { apiClient } from "./apiClient";
import { AuditRun } from "../types";

export const createAudit = async (url: string): Promise<AuditRun> => {
  const response = await apiClient.post("/audit/", { url });
  return response.data;
};

export const getAudit = async (id: number): Promise<AuditRun> => {
  const response = await apiClient.get(/audit/);
  return response.data;
};

export const getAudits = async (skip = 0, limit = 100): Promise<AuditRun[]> => {
  const response = await apiClient.get(/audit/?skip=&limit=);
  return response.data;
};
''',
    'frontend/services/dashboardApi.ts': '''import { apiClient } from "./apiClient";
import { DashboardSummary } from "../types";

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const response = await apiClient.get("/dashboard/");
  return response.data;
};
''',
    'frontend/store/auditStore.ts': '''import { create } from "zustand";
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
''',
    'frontend/store/dashboardStore.ts': '''import { create } from "zustand";
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
'''
}

for filepath, content in files.items():
    with open(filepath, 'w') as f:
        f.write(content)
