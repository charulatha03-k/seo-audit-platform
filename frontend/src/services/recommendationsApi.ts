import { apiClient } from "./apiClient";
import { AuditRecommendation } from "./auditApi";

export interface RecommendationListResponse {
  total: number;
  skip: number;
  limit: number;
  items: AuditRecommendation[];
}

export const recommendationsApi = {
  list: async (params?: {
    audit_id?: number;
    priority?: string;
    impact?: string;
    search?: string;
    skip?: number;
    limit?: number;
  }): Promise<RecommendationListResponse> => {
    const res = await apiClient.get("/recommendations/", { params });
    return res.data;
  },
};
