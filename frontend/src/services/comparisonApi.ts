import { apiClient } from "./apiClient";
import { AuditReport } from "./auditApi";

export interface ComparisonResult {
  audit1: AuditReport;
  audit2: AuditReport;
  score_diff: Record<string, number>;
  metric_diff: Record<string, number>;
}

export const comparisonApi = {
  compare: async (audit1: number, audit2: number): Promise<ComparisonResult> => {
    const res = await apiClient.get("/comparison/", { params: { audit1, audit2 } });
    return res.data;
  },
};
