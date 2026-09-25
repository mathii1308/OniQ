from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import UPLOADS_DIR, GEMINI_API_KEY
from app.database import engine, Base, SessionLocal
from app.routes.analyze import router as analyze_router
from app.routes.assessments import router as assessments_router, seed_sample_records
from app.routes.auth import router as auth_router, seed_sample_centers

# Initialize SQLite tables
Base.metadata.create_all(bind=engine)

# Seed initial prototype data
with SessionLocal() as db:
    seed_sample_records(db)
    seed_sample_centers(db)

app = FastAPI(
    title="OniQ API",
    description="Intelligent Onion Quality Assessment API - SIH 2026 Prototype",
    version="1.0.0"
)

# Enable CORS for React Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded batch images
app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")

# Include Routers
app.include_router(analyze_router)
app.include_router(assessments_router)
app.include_router(auth_router)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "system": "OniQ — Intelligent Onion Quality Assessment",
        "mode": "AI Vision Analysis Mode" if GEMINI_API_KEY else "Demo Analysis Mode",
        "gemini_api_configured": bool(GEMINI_API_KEY)
    }
