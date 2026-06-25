from sqlalchemy.orm import Session
from database.models import Website

class WebsiteRepository:
    def get_by_url(self, db: Session, url: str):
        return db.query(Website).filter(Website.url == url).first()

    def create(self, db: Session, url: str):
        db_website = Website(url=url)
        db.add(db_website)
        db.commit()
        db.refresh(db_website)
        return db_website
