import os

files = {
    'backend/database/repositories/website_repository.py': '''from sqlalchemy.orm import Session
from database.models import Website

class WebsiteRepository:
    def get_by_url(self, db: Session, url: str):
        return db.query(Website).filter(Website.url == url).first()

    def create(self, db: Session, url: str):
        db_website = Website(url=url)
        db.add(db_website)
        db.commit()
        db.refresh(db_website)
        return db_website
''',
    'backend/database/repositories/audit_repository.py': '''from sqlalchemy.orm import Session
from database.models import AuditRun

class AuditRepository:
    def get_all(self, db: Session, skip: int = 0, limit: int = 100):
        return db.query(AuditRun).order_by(AuditRun.audit_date.desc()).offset(skip).limit(limit).all()

    def get_by_id(self, db: Session, audit_id: int):
        return db.query(AuditRun).filter(AuditRun.id == audit_id).first()

    def create(self, db: Session, website_id: int):
        db_audit = AuditRun(website_id=website_id)
        db.add(db_audit)
        db.commit()
        db.refresh(db_audit)
        return db_audit
        
    def count(self, db: Session):
        return db.query(AuditRun).count()
        
    def update(self, db: Session, audit: AuditRun):
        db.commit()
        db.refresh(audit)
        return audit
''',
    'backend/services/audit_service.py': '''from sqlalchemy.orm import Session
from database.repositories.website_repository import WebsiteRepository
from database.repositories.audit_repository import AuditRepository
from database.models import SeoIssue, PerformanceMetric, AiRecommendation, AuditStatus
from audit_engine.client import AuditEngineClient

class AuditService:
    def __init__(self):
        self.website_repo = WebsiteRepository()
        self.audit_repo = AuditRepository()
        self.engine_client = AuditEngineClient()

    def create_audit(self, db: Session, url: str):
        website = self.website_repo.get_by_url(db, url)
        if not website:
            website = self.website_repo.create(db, url)
            
        audit = self.audit_repo.create(db, website.id)
        
        # Call mock engine
        audit.status = AuditStatus.running.value
        self.audit_repo.update(db, audit)
        
        try:
            results = self.engine_client.run_audit(url)
            
            audit.seo_score = results['seo_score']
            audit.performance_score = results['performance_score']
            audit.accessibility_score = results['accessibility_score']
            audit.compatibility_score = results['compatibility_score']
            audit.overall_score = results['overall_score']
            audit.status = AuditStatus.completed.value
            
            # Add metrics
            m = results['metrics']
            db.add(PerformanceMetric(audit_id=audit.id, lcp=m['lcp'], cls_metric=m['cls'], inp=m['inp'], fcp=m['fcp'], ttfb=m['ttfb']))
            
            # Add issues
            issues = results['issues']
            audit.issue_count = len(issues)
            for iss in issues:
                db.add(SeoIssue(audit_id=audit.id, **iss))
                
            # Add recommendations
            recs = results['recommendations']
            for rec in recs:
                db.add(AiRecommendation(audit_id=audit.id, **rec))
                
            self.audit_repo.update(db, audit)
            return audit
            
        except Exception as e:
            audit.status = AuditStatus.failed.value
            self.audit_repo.update(db, audit)
            raise e

    def get_audit(self, db: Session, audit_id: int):
        return self.audit_repo.get_by_id(db, audit_id)
        
    def get_audits(self, db: Session, skip: int = 0, limit: int = 100):
        return self.audit_repo.get_all(db, skip, limit)
''',
    'backend/services/dashboard_service.py': '''from sqlalchemy.orm import Session
from sqlalchemy import func
from database.models import AuditRun, SeoIssue
from database.repositories.audit_repository import AuditRepository

class DashboardService:
    def __init__(self):
        self.audit_repo = AuditRepository()

    def get_summary(self, db: Session):
        total_audits = self.audit_repo.count(db)
        
        avg_scores = db.query(
            func.avg(AuditRun.seo_score),
            func.avg(AuditRun.performance_score),
            func.avg(AuditRun.accessibility_score),
            func.avg(AuditRun.compatibility_score)
        ).filter(AuditRun.status == 'completed').first()
        
        recent_audits = self.audit_repo.get_all(db, 0, 5)
        
        # issues by severity
        severity_counts = db.query(SeoIssue.severity, func.count(SeoIssue.id)).group_by(SeoIssue.severity).all()
        issues_by_severity = {s: c for s, c in severity_counts}
        
        # dummy score trends
        score_trends = [
            {"date": a.audit_date.strftime("%Y-%m-%d"), "score": a.overall_score} 
            for a in reversed(recent_audits) if a.overall_score is not None
        ]

        return {
            "total_audits": total_audits,
            "average_seo_score": avg_scores[0] or 0,
            "average_performance_score": avg_scores[1] or 0,
            "average_accessibility_score": avg_scores[2] or 0,
            "average_compatibility_score": avg_scores[3] or 0,
            "recent_audits": recent_audits,
            "issues_by_severity": issues_by_severity,
            "score_trends": score_trends
        }
''',
    'backend/api/audit.py': '''from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.connection import get_db
from database import schemas
from services.audit_service import AuditService
from typing import List

router = APIRouter()
audit_service = AuditService()

@router.post("/", response_model=schemas.AuditRunResponse)
def create_audit(audit_in: schemas.AuditRunCreate, db: Session = Depends(get_db)):
    return audit_service.create_audit(db, audit_in.url)

@router.get("/{audit_id}", response_model=schemas.AuditRunResponse)
def get_audit(audit_id: int, db: Session = Depends(get_db)):
    audit = audit_service.get_audit(db, audit_id)
    if not audit:
        raise HTTPException(status_code=404, detail="Audit not found")
    return audit

@router.get("/", response_model=List[schemas.AuditRunResponse])
def get_audits(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return audit_service.get_audits(db, skip, limit)
''',
    'backend/api/dashboard.py': '''from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.connection import get_db
from database import schemas
from services.dashboard_service import DashboardService

router = APIRouter()
dashboard_service = DashboardService()

@router.get("/", response_model=schemas.AuditSummary)
def get_dashboard_summary(db: Session = Depends(get_db)):
    return dashboard_service.get_summary(db)
'''
}

for filepath, content in files.items():
    os.makedirs(os.path.dirname(filepath), exist_ok=True) if os.path.dirname(filepath) else None
    with open(filepath, 'w') as f:
        f.write(content)
