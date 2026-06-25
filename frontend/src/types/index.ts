export interface Website {
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
