import { apiClient } from "./apiClient";
import { AuditIssue } from "./auditApi";

export interface IssueListResponse {
  total: number;
  skip: number;
  limit: number;
  items: AuditIssue[];
}

export const issuesApi = {
  list: async (params?: {
    audit_id?: number;
    severity?: string;
    category?: string;
    search?: string;
    skip?: number;
    limit?: number;
  }): Promise<IssueListResponse> => {
    const res = await apiClient.get("/issues/", { params });
    return res.data;
  },
};
