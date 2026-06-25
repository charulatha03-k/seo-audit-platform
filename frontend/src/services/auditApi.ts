import { apiClient } from "./apiClient";

export interface AuditScores {
  seo_score: number | null;
  performance_score: number | null;
  accessibility_score: number | null;
  compatibility_score: number | null;
  overall_score: number | null;
}

export interface AuditMetrics {
  lcp: number | null;
  cls: number | null;
  inp: number | null;
  fcp: number | null;
  ttfb: number | null;
}

export interface AuditIssue {
  id: number;
  audit_id: number;
  severity: "critical" | "high" | "medium" | "low";
  category: "seo" | "performance" | "accessibility" | "compatibility";
  title: string;
  description: string;
  recommendation: string;
}

export interface AuditRecommendation {
  id: number;
  audit_id: number;
  title: string;
  recommendation: string;
  priority: "high" | "medium" | "low";
  impact: "high" | "medium" | "low";
}

export interface AuditReport {
  audit_id: number;
  url: string;
  status: string;
  audit_date: string;
  issue_count: number;
  scores: AuditScores;
  metrics: AuditMetrics;
  issues: AuditIssue[];
  recommendations: AuditRecommendation[];
}

export const auditApi = {
  create: async (url: string): Promise<AuditReport> => {
    const res = await apiClient.post("/audit/", { url });
    return res.data;
  },
  getById: async (id: number): Promise<AuditReport> => {
    const res = await apiClient.get(`/audit/${id}`);
    return res.data;
  },
  list: async (skip = 0, limit = 50): Promise<AuditReport[]> => {
    const res = await apiClient.get(`/audit/?skip=${skip}&limit=${limit}`);
    return res.data;
  },
};
