from sqlalchemy.orm import Session
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
