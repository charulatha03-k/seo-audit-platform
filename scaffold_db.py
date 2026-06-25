import os

files = {
    'backend/database/connection.py': '''from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from core.config import settings

engine = create_engine(
    settings.DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
''',
    'backend/database/models.py': '''from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from database.connection import Base

class IssueSeverity(str, enum.Enum):
    critical = "critical"
    high = "high"
    medium = "medium"
    low = "low"

class IssueCategory(str, enum.Enum):
    seo = "seo"
    performance = "performance"
    accessibility = "accessibility"
    compatibility = "compatibility"

class AuditStatus(str, enum.Enum):
    pending = "pending"
    running = "running"
    completed = "completed"
    failed = "failed"

class Website(Base):
    __tablename__ = "websites"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    audits = relationship("AuditRun", back_populates="website", cascade="all, delete-orphan")

class AuditRun(Base):
    __tablename__ = "audit_runs"

    id = Column(Integer, primary_key=True, index=True)
    website_id = Column(Integer, ForeignKey("websites.id"), nullable=False)
    audit_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default=AuditStatus.pending.value)

    seo_score = Column(Float, nullable=True)
    performance_score = Column(Float, nullable=True)
    accessibility_score = Column(Float, nullable=True)
    compatibility_score = Column(Float, nullable=True)
    overall_score = Column(Float, nullable=True)

    issue_count = Column(Integer, default=0)

    website = relationship("Website", back_populates="audits")
    issues = relationship("SeoIssue", back_populates="audit", cascade="all, delete-orphan")
    metrics = relationship("PerformanceMetric", back_populates="audit", cascade="all, delete-orphan", uselist=False)
    recommendations = relationship("AiRecommendation", back_populates="audit", cascade="all, delete-orphan")

class SeoIssue(Base):
    __tablename__ = "seo_issues"

    id = Column(Integer, primary_key=True, index=True)
    audit_id = Column(Integer, ForeignKey("audit_runs.id"), nullable=False)
    severity = Column(String, nullable=False)
    category = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    recommendation = Column(Text, nullable=True)

    audit = relationship("AuditRun", back_populates="issues")

class PerformanceMetric(Base):
    __tablename__ = "performance_metrics"

    id = Column(Integer, primary_key=True, index=True)
    audit_id = Column(Integer, ForeignKey("audit_runs.id"), nullable=False, unique=True)
    
    lcp = Column(Float, nullable=True)
    cls_metric = Column(Float, nullable=True) # cls is a reserved keyword in some contexts, using cls_metric
    inp = Column(Float, nullable=True)
    fcp = Column(Float, nullable=True)
    ttfb = Column(Float, nullable=True)

    audit = relationship("AuditRun", back_populates="metrics")

class AiRecommendation(Base):
    __tablename__ = "ai_recommendations"

    id = Column(Integer, primary_key=True, index=True)
    audit_id = Column(Integer, ForeignKey("audit_runs.id"), nullable=False)
    
    title = Column(String, nullable=False)
    recommendation = Column(Text, nullable=False)
    priority = Column(String, nullable=False)
    impact = Column(String, nullable=False)

    audit = relationship("AuditRun", back_populates="recommendations")
''',
    'backend/database/schemas.py': '''from pydantic import BaseModel, HttpUrl
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
'''
}

for filepath, content in files.items():
    os.makedirs(os.path.dirname(filepath), exist_ok=True) if os.path.dirname(filepath) else None
    with open(filepath, 'w') as f:
        f.write(content)
