from sqlalchemy.orm import Session
from database.models import SeoIssue

class IssueRepository:
    def create(self, db: Session, issue_data: dict):
        db_issue = SeoIssue(**issue_data)
        db.add(db_issue)
        return db_issue
