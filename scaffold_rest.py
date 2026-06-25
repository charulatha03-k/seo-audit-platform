import os

files = {
    'backend/api/issues.py': '''from fastapi import APIRouter
router = APIRouter()
@router.get("/")
def get_issues(): return []
''',
    'backend/api/recommendations.py': '''from fastapi import APIRouter
router = APIRouter()
@router.get("/")
def get_recommendations(): return []
''',
    'backend/api/comparison.py': '''from fastapi import APIRouter
router = APIRouter()
@router.get("/")
def compare(): return {}
''',
    'backend/api/history.py': '''from fastapi import APIRouter
router = APIRouter()
@router.get("/")
def get_history(): return []
''',
    'backend/api/reports.py': '''from fastapi import APIRouter
router = APIRouter()
@router.get("/{audit_id}")
def get_report(audit_id: int): return {}
@router.get("/{audit_id}/pdf")
def get_pdf(audit_id: int): return {}
'''
}

for filepath, content in files.items():
    with open(filepath, 'w') as f:
        f.write(content)

# Update main.py
with open("backend/main.py", "a") as f:
    f.write('''
from api import issues, recommendations, comparison, history, reports
app.include_router(issues.router, prefix=f"{settings.API_V1_STR}/issues", tags=["issues"])
app.include_router(recommendations.router, prefix=f"{settings.API_V1_STR}/recommendations", tags=["recommendations"])
app.include_router(comparison.router, prefix=f"{settings.API_V1_STR}/comparison", tags=["comparison"])
app.include_router(history.router, prefix=f"{settings.API_V1_STR}/history", tags=["history"])
app.include_router(reports.router, prefix=f"{settings.API_V1_STR}/reports", tags=["reports"])
''')
