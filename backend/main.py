import logging
from fastapi import FastAPI
from core.config import settings
from fastapi.middleware.cors import CORSMiddleware
from database.connection import engine, Base
from api import auth, audit, dashboard, issues, recommendations, comparison, history, reports
from database import models

logger = logging.getLogger(__name__)

# Log database connection string
logger.info(f"Connected database URL: {settings.DATABASE_URL}")

# Count models by inspecting Base.metadata.tables
model_count = len(Base.metadata.tables)
logger.info(f"Number of discovered models/tables: {model_count}")

# Create tables
Base.metadata.create_all(bind=engine)
logger.info(f"Tables created: {list(Base.metadata.tables.keys())}")

app = FastAPI(title=settings.PROJECT_NAME, openapi_url=f"{settings.API_V1_STR}/openapi.json")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(audit.router, prefix=f"{settings.API_V1_STR}/audit", tags=["audit"])
app.include_router(dashboard.router, prefix=f"{settings.API_V1_STR}/dashboard", tags=["dashboard"])
app.include_router(issues.router, prefix=f"{settings.API_V1_STR}/issues", tags=["issues"])
app.include_router(recommendations.router, prefix=f"{settings.API_V1_STR}/recommendations", tags=["recommendations"])
app.include_router(comparison.router, prefix=f"{settings.API_V1_STR}/comparison", tags=["comparison"])
app.include_router(history.router, prefix=f"{settings.API_V1_STR}/history", tags=["history"])
app.include_router(reports.router, prefix=f"{settings.API_V1_STR}/reports", tags=["reports"])

@app.get("/")
def root():
    return {"message": "SEO Audit Platform API is running"}
