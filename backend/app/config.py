import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOADS_DIR = BASE_DIR / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/oniq.db")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()

# Grading thresholds (Configurable prototype rules)
GRADING_RULES = {
    "GRADE_A": {
        "min_healthy": 70,
        "max_rotten": 5,
        "max_sprouted": 5,
        "description": "Premium Grade A Onion Batch - High visual purity, minimal defects."
    },
    "GRADE_B": {
        "min_healthy": 50,
        "max_rotten": 10,
        "max_sprouted": 15,
        "description": "Standard Grade B Batch - Moderately healthy, suitable for immediate retail/distribution."
    },
    "GRADE_C": {
        "min_healthy": 30,
        "max_rotten": 20,
        "max_sprouted": 25,
        "description": "Commercial Grade C Batch - Higher defect proportion, suitable for industrial processing."
    }
}
