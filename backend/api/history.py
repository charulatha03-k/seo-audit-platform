from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from database.connection import get_db
from services.audit_service import AuditService

router = APIRouter()
audit_service = AuditService()


@router.get("/")
def get_history(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    """Return paginated audit history, newest first."""
    return audit_service.get_audits(db, skip=skip, limit=limit)
