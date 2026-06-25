from sqlalchemy.orm import Session
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
