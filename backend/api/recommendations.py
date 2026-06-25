from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from database.connection import get_db
from database.models import AiRecommendation

router = APIRouter()


@router.get("/")
def list_recommendations(
    audit_id: int | None = Query(None),
    priority: str | None = Query(None),
    impact: str | None = Query(None),
    search: str | None = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    """
    Return AI recommendations with optional filters:
      - audit_id: filter by a specific audit
      - priority: high | medium | low
      - impact: high | medium | low
      - search: free-text on title / recommendation
    """
    q = db.query(AiRecommendation)
    if audit_id is not None:
        q = q.filter(AiRecommendation.audit_id == audit_id)
    if priority:
        q = q.filter(AiRecommendation.priority == priority)
    if impact:
        q = q.filter(AiRecommendation.impact == impact)
    if search:
        term = f"%{search}%"
        q = q.filter(
            AiRecommendation.title.ilike(term)
            | AiRecommendation.recommendation.ilike(term)
        )

    total = q.count()
    rows = q.order_by(AiRecommendation.id.desc()).offset(skip).limit(limit).all()

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "items": [
            {
                "id": r.id,
                "audit_id": r.audit_id,
                "title": r.title,
                "recommendation": r.recommendation,
                "priority": r.priority,
                "impact": r.impact,
            }
            for r in rows
        ],
    }
