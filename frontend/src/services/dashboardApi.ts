import { apiClient } from "./apiClient";

export interface DashboardData {
  total_audits: number;
  average_seo_score: number;
  average_performance_score: number;
  average_accessibility_score: number;
  average_compatibility_score: number;
  recent_audits: {
    audit_id: number;
    url: string;
    overall_score: number;
    seo_score: number;
    audit_date: string;
    issue_count: number;
    status: string;
  }[];
  issues_by_severity: Record<string, number>;
  score_trends: { date: string; overall_score: number; seo_score: number; performance_score: number }[];
}

export const dashboardApi = {
  getSummary: async (): Promise<DashboardData> => {
    const res = await apiClient.get("/dashboard/");
    return res.data;
  },
};
