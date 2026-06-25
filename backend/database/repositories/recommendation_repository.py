from sqlalchemy.orm import Session
from database.models import AiRecommendation

class RecommendationRepository:
    def create(self, db: Session, rec_data: dict):
        db_rec = AiRecommendation(**rec_data)
        db.add(db_rec)
        return db_rec
