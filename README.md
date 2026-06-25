# SEO Audit Platform

## Overview
This is a production-ready AI-Powered SEO Audit Platform with a mocked-out Audit Engine ready to be replaced with the real implementation.

## Architecture
- **Frontend**: Next.js 15, Tailwind CSS, ShadCN UI, Zustand, Axios
- **Backend**: FastAPI, SQLAlchemy, PostgreSQL (SQLite fallback for dev)
- **DevOps**: Docker, Docker Compose

## Mock Audit Engine Integration
The mock engine is located at ackend/audit_engine/client.py.
To integrate the real engine, simply replace the AuditEngineClient class and 
un_audit(url) method implementation in that file. **No other code requires modification.**

## Running the Application
### Using Docker Compose (Recommended)
1. Ensure Docker is running.
2. Run docker-compose up --build
3. Frontend will be at http://localhost:3000
4. Backend API will be at http://localhost:8000/api

### Local Development
**Backend:**
1. cd backend
2. pip install -r requirements.txt
3. uvicorn main:app --reload

**Frontend:**
1. cd frontend
2. 
pm install
3. 
pm run dev
