import logging
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database.connection import get_db
from services.audit_service import AuditService
from pydantic import BaseModel

logger = logging.getLogger(__name__)
router = APIRouter()
audit_service = AuditService()


class AuditRequest(BaseModel):
    url: str


@router.post("/")
def create_audit(body: AuditRequest, db: Session = Depends(get_db)):
    """Submit a URL to run a new audit and persist all results."""
    try:
        return audit_service.create_audit(db, body.url)
    except Exception as e:
        logger.error(f"Audit creation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/")
def list_audits(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    """Return a paginated list of all audits."""
    return audit_service.get_audits(db, skip=skip, limit=limit)


@router.get("/{audit_id}")
def get_audit(audit_id: int, db: Session = Depends(get_db)):
    """Return the full audit report for a given audit ID."""
    audit = audit_service.get_audit(db, audit_id)
    if not audit:
        raise HTTPException(status_code=404, detail=f"Audit {audit_id} not found")
    return audit
