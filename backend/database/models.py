from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from database.connection import engine, Base
from database import models



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
    url = Column(String, nullable=False)
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
    url = Column(String, nullable=False)
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
    url = Column(String, nullable=False)
    
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
    url = Column(String, nullable=False)
    title = Column(String, nullable=False)
    recommendation = Column(Text, nullable=False)
    priority = Column(String, nullable=False)
    impact = Column(String, nullable=False)

    audit = relationship("AuditRun", back_populates="recommendations")
