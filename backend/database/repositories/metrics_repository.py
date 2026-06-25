from sqlalchemy.orm import Session
from database.models import PerformanceMetric

class MetricsRepository:
    def create(self, db: Session, metric_data: dict):
        db_metric = PerformanceMetric(**metric_data)
        db.add(db_metric)
        return db_metric
