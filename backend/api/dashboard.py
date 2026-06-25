from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from database.connection import get_db
from database.models import AuditRun, SeoIssue
from database.repositories.audit_repository import AuditRepository

router = APIRouter()
audit_repo = AuditRepository()


@router.get("/")
def get_dashboard(db: Session = Depends(get_db)):
    """Return KPI summary cards, score trends, and recent audits for the dashboard."""
    total_audits = db.query(func.count(AuditRun.id)).filter(AuditRun.status == "completed").scalar() or 0

    avg = db.query(
        func.avg(AuditRun.seo_score),
        func.avg(AuditRun.performance_score),
        func.avg(AuditRun.accessibility_score),
        func.avg(AuditRun.compatibility_score),
    ).filter(AuditRun.status == "completed").first()

    avg_seo = round(avg[0] or 0, 1)
    avg_perf = round(avg[1] or 0, 1)
    avg_acc = round(avg[2] or 0, 1)
    avg_comp = round(avg[3] or 0, 1)

    # Recent 5 audits
    recent_raw = (
        db.query(AuditRun)
        .filter(AuditRun.status == "completed")
        .order_by(AuditRun.audit_date.desc())
        .limit(5)
        .all()
    )
    recent_audits = [
        {
            "audit_id": a.id,
            "url": a.website.url if a.website else "",
            "overall_score": a.overall_score,
            "seo_score": a.seo_score,
            "audit_date": a.audit_date.isoformat() if a.audit_date else None,
            "issue_count": a.issue_count,
            "status": a.status,
        }
        for a in recent_raw
    ]

    # Issues by severity across all audits
    severity_rows = (
        db.query(SeoIssue.severity, func.count(SeoIssue.id))
        .group_by(SeoIssue.severity)
        .all()
    )
    issues_by_severity = {row[0]: row[1] for row in severity_rows}

    # Score trend — last 20 completed audits ordered chronologically
    trend_raw = (
        db.query(AuditRun)
        .filter(AuditRun.status == "completed", AuditRun.overall_score.isnot(None))
        .order_by(AuditRun.audit_date.asc())
        .limit(20)
        .all()
    )
    score_trends = [
        {
            "date": a.audit_date.strftime("%Y-%m-%d") if a.audit_date else "",
            "overall_score": a.overall_score,
            "seo_score": a.seo_score,
            "performance_score": a.performance_score,
        }
        for a in trend_raw
    ]

    return {
        "total_audits": total_audits,
        "average_seo_score": avg_seo,
        "average_performance_score": avg_perf,
        "average_accessibility_score": avg_acc,
        "average_compatibility_score": avg_comp,
        "recent_audits": recent_audits,
        "issues_by_severity": issues_by_severity,
        "score_trends": score_trends,
    }
