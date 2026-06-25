import logging
from sqlalchemy.orm import Session
from sqlalchemy import func
from database.repositories.website_repository import WebsiteRepository
from database.repositories.audit_repository import AuditRepository
from database.repositories.issue_repository import IssueRepository
from database.repositories.metrics_repository import MetricsRepository
from database.repositories.recommendation_repository import RecommendationRepository
from database.models import AuditRun, SeoIssue, AiRecommendation, AuditStatus
from audit_engine.client import get_audit_engine_client

logger = logging.getLogger(__name__)


class AuditService:
    def __init__(self):
        self.website_repo = WebsiteRepository()
        self.audit_repo = AuditRepository()
        self.issue_repo = IssueRepository()
        self.metrics_repo = MetricsRepository()
        self.recommendation_repo = RecommendationRepository()
        # Factory call — only this line changes when real engine is integrated
        self.engine_client = get_audit_engine_client()

    def create_audit(self, db: Session, url: str) -> dict:
        """
        Full audit pipeline:
          1. Upsert website
          2. Create audit_run (status=running)
          3. Call engine client
          4. Persist scores, metrics, issues, recommendations
          5. Commit and return structured dict
        """
        # Step 1 & 2: Upsert website
        website = self.website_repo.get_by_url(db, url)
        if not website:
            website = self.website_repo.create(db, url)

        # Step 3: Create audit_run
        audit = self.audit_repo.create(db, website.id)
        audit.status = AuditStatus.running.value
        self.audit_repo.update(db, audit)

        try:
            # Step 4: Call engine
            logger.info(f"[AuditService] Starting audit for: {url}")
            results = self.engine_client.run_audit(url)

            # Step 5: Update scores
            audit.seo_score = results.get("seo_score")
            audit.performance_score = results.get("performance_score")
            audit.accessibility_score = results.get("accessibility_score")
            audit.compatibility_score = results.get("compatibility_score")
            audit.overall_score = results.get("overall_score")
            audit.status = AuditStatus.completed.value

            # Step 6: Save metrics
            m = results.get("metrics", {})
            self.metrics_repo.create(db, {
                "audit_id": audit.id,
                "lcp": m.get("lcp"),
                "cls_metric": m.get("cls"),
                "inp": m.get("inp"),
                "fcp": m.get("fcp"),
                "ttfb": m.get("ttfb"),
            })

            # Step 7: Save issues
            issues = results.get("issues", [])
            audit.issue_count = len(issues)
            for iss in issues:
                self.issue_repo.create(db, {
                    "audit_id": audit.id,
                    "severity": iss.get("severity"),
                    "category": iss.get("category"),
                    "title": iss.get("title"),
                    "description": iss.get("description"),
                    "recommendation": iss.get("recommendation"),
                })

            # Step 8: Save recommendations
            for rec in results.get("recommendations", []):
                self.recommendation_repo.create(db, {
                    "audit_id": audit.id,
                    "title": rec.get("title"),
                    "recommendation": rec.get("recommendation"),
                    "priority": rec.get("priority"),
                    "impact": rec.get("impact"),
                })

            # Step 9: Commit single transaction
            db.commit()
            db.refresh(audit)
            logger.info(f"[AuditService] Audit #{audit.id} completed. Issues: {audit.issue_count}")

            return self._serialize_audit(audit)

        except Exception as e:
            logger.error(f"[AuditService] Audit failed for {url}: {e}")
            audit.status = AuditStatus.failed.value
            self.audit_repo.update(db, audit)
            db.commit()
            raise

    def get_audit(self, db: Session, audit_id: int) -> dict | None:
        audit = self.audit_repo.get_by_id(db, audit_id)
        if not audit:
            return None
        return self._serialize_audit(audit)

    def get_audits(self, db: Session, skip: int = 0, limit: int = 100) -> list[dict]:
        audits = self.audit_repo.get_all(db, skip, limit)
        return [self._serialize_audit(a) for a in audits]

    def _serialize_audit(self, audit: AuditRun) -> dict:
        """Single serialization point for AuditRun → JSON-safe dict."""
        return {
            "audit_id": audit.id,
            "url": audit.website.url if audit.website else "",
            "status": audit.status,
            "audit_date": audit.audit_date.isoformat() if audit.audit_date else None,
            "issue_count": audit.issue_count,
            "scores": {
                "seo_score": audit.seo_score,
                "performance_score": audit.performance_score,
                "accessibility_score": audit.accessibility_score,
                "compatibility_score": audit.compatibility_score,
                "overall_score": audit.overall_score,
            },
            "metrics": {
                "lcp": audit.metrics.lcp if audit.metrics else None,
                "cls": audit.metrics.cls_metric if audit.metrics else None,
                "inp": audit.metrics.inp if audit.metrics else None,
                "fcp": audit.metrics.fcp if audit.metrics else None,
                "ttfb": audit.metrics.ttfb if audit.metrics else None,
            },
            "issues": [
                {
                    "id": i.id,
                    "severity": i.severity,
                    "category": i.category,
                    "title": i.title,
                    "description": i.description,
                    "recommendation": i.recommendation,
                }
                for i in (audit.issues or [])
            ],
            "recommendations": [
                {
                    "id": r.id,
                    "title": r.title,
                    "recommendation": r.recommendation,
                    "priority": r.priority,
                    "impact": r.impact,
                }
                for r in (audit.recommendations or [])
            ],
        }
