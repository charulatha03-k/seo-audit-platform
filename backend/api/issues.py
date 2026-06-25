from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from database.connection import get_db
from database.models import SeoIssue

router = APIRouter()


@router.get("/")
def list_issues(
    audit_id: int | None = Query(None),
    severity: str | None = Query(None),
    category: str | None = Query(None),
    search: str | None = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    """
    Return issues with optional filters:
      - audit_id: filter by a specific audit
      - severity: critical | high | medium | low
      - category: seo | performance | accessibility | compatibility
      - search: free-text search on title / description
    """
    q = db.query(SeoIssue)
    if audit_id is not None:
        q = q.filter(SeoIssue.audit_id == audit_id)
    if severity:
        q = q.filter(SeoIssue.severity == severity)
    if category:
        q = q.filter(SeoIssue.category == category)
    if search:
        term = f"%{search}%"
        q = q.filter(
            SeoIssue.title.ilike(term) | SeoIssue.description.ilike(term)
        )

    total = q.count()
    rows = q.order_by(SeoIssue.id.desc()).offset(skip).limit(limit).all()

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "items": [
            {
                "id": i.id,
                "audit_id": i.audit_id,
                "severity": i.severity,
                "category": i.category,
                "title": i.title,
                "description": i.description,
                "recommendation": i.recommendation,
            }
            for i in rows
        ],
    }
