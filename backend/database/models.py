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

class Role(str, enum.Enum):
    owner = "owner"
    admin = "admin"
    seo_analyst = "seo_analyst"
    viewer = "viewer"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    company_name = Column(String, nullable=True)
    is_active = Column(Integer, default=1)
    is_verified = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    teams = relationship("TeamMember", back_populates="user")
    sessions = relationship("UserSession", back_populates="user")

class UserSession(Base):
    __tablename__ = "user_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token = Column(String, unique=True, index=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    device_info = Column(String, nullable=True)

    user = relationship("User", back_populates="sessions")

class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    members = relationship("TeamMember", back_populates="team", cascade="all, delete-orphan")
    websites = relationship("Website", back_populates="team")

class TeamMember(Base):
    __tablename__ = "team_members"

    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role = Column(String, default=Role.viewer.value)
    
    team = relationship("Team", back_populates="members")
    user = relationship("User", back_populates="teams")


class Website(Base):
    __tablename__ = "websites"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, index=True, nullable=False)  # Removed unique=True to allow different teams to audit the same URL
    team_id = Column(Integer, ForeignKey("teams.id", ondelete="CASCADE"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    team = relationship("Team", back_populates="websites")
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
