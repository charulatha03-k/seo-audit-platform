from pydantic import BaseModel, HttpUrl
from typing import List, Optional
from datetime import datetime

class WebsiteBase(BaseModel):
    url: str

class WebsiteCreate(WebsiteBase):
    pass

class WebsiteResponse(WebsiteBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class PerformanceMetricBase(BaseModel):
    lcp: Optional[float] = None
    cls_metric: Optional[float] = None
    inp: Optional[float] = None
    fcp: Optional[float] = None
    ttfb: Optional[float] = None

class PerformanceMetricResponse(PerformanceMetricBase):
    id: int
    audit_id: int
    class Config:
        from_attributes = True

class SeoIssueBase(BaseModel):
    severity: str
    category: str
    title: str
    description: str
    recommendation: Optional[str] = None

class SeoIssueResponse(SeoIssueBase):
    id: int
    audit_id: int
    class Config:
        from_attributes = True

class AiRecommendationBase(BaseModel):
    title: str
    recommendation: str
    priority: str
    impact: str

class AiRecommendationResponse(AiRecommendationBase):
    id: int
    audit_id: int
    class Config:
        from_attributes = True

class AuditRunBase(BaseModel):
    website_id: int
    status: str
    seo_score: Optional[float] = None
    performance_score: Optional[float] = None
    accessibility_score: Optional[float] = None
    compatibility_score: Optional[float] = None
    overall_score: Optional[float] = None
    issue_count: Optional[int] = 0

class AuditRunCreate(BaseModel):
    url: str

class AuditRunResponse(AuditRunBase):
    id: int
    audit_date: datetime
    metrics: Optional[PerformanceMetricResponse] = None
    issues: List[SeoIssueResponse] = []
    recommendations: List[AiRecommendationResponse] = []
    class Config:
        from_attributes = True
        
class AuditSummary(BaseModel):
    total_audits: int
    average_seo_score: float
    average_performance_score: float
    average_accessibility_score: float
    average_compatibility_score: float
    recent_audits: List[AuditRunResponse]
    issues_by_severity: dict
    score_trends: List[dict]
