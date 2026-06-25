from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database.connection import get_db
from services.audit_service import AuditService

router = APIRouter()
audit_service = AuditService()


@router.get("/")
def compare_audits(
    audit1: int = Query(..., description="First audit ID"),
    audit2: int = Query(..., description="Second audit ID"),
    db: Session = Depends(get_db),
):
    """Compare two audits side by side, computing score and metric differences."""
    a1 = audit_service.get_audit(db, audit1)
    a2 = audit_service.get_audit(db, audit2)

    if not a1:
        raise HTTPException(status_code=404, detail=f"Audit {audit1} not found")
    if not a2:
        raise HTTPException(status_code=404, detail=f"Audit {audit2} not found")

    def diff(key, s1, s2):
        """Return absolute difference with direction."""
        v1 = s1.get(key) or 0
        v2 = s2.get(key) or 0
        return round(v2 - v1, 2)

    score_keys = ["seo_score", "performance_score", "accessibility_score", "compatibility_score", "overall_score"]
    metric_keys = ["lcp", "cls", "inp", "fcp", "ttfb"]

    return {
        "audit1": a1,
        "audit2": a2,
        "score_diff": {k: diff(k, a1["scores"], a2["scores"]) for k in score_keys},
        "metric_diff": {k: diff(k, a1["metrics"], a2["metrics"]) for k in metric_keys},
    }
