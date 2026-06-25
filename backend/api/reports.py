from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from database.connection import get_db
from services.audit_service import AuditService

router = APIRouter()
audit_service = AuditService()


@router.get("/{audit_id}")
def get_report(audit_id: int, db: Session = Depends(get_db)):
    """Return full JSON report for a given audit."""
    audit = audit_service.get_audit(db, audit_id)
    if not audit:
        raise HTTPException(status_code=404, detail=f"Audit {audit_id} not found")
    return audit


@router.get("/")
def list_reports(db: Session = Depends(get_db)):
    """List all completed audits that have reports available."""
    audits = audit_service.get_audits(db, skip=0, limit=200)
    return [
        {
            "audit_id": a["audit_id"],
            "url": a["url"],
            "overall_score": a["scores"]["overall_score"],
            "audit_date": a["audit_date"],
            "issue_count": a["issue_count"],
        }
        for a in audits
        if a["status"] == "completed"
    ]
