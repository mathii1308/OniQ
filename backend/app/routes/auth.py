from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import hashlib

from app.database import get_db, SessionLocal
from app.models import ProcurementCenterUser
from app.schemas import CenterRegisterSchema, CenterLoginSchema, CenterUserResponseSchema

router = APIRouter(prefix="/api/auth", tags=["Auth"])

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

@router.post("/register", response_model=CenterUserResponseSchema)
def register_center(data: CenterRegisterSchema, db: Session = Depends(get_db)):
    # Check if center_code or email exists
    existing_code = db.query(ProcurementCenterUser).filter(ProcurementCenterUser.center_code == data.center_code.strip()).first()
    if existing_code:
        raise HTTPException(status_code=400, detail="Center code already registered.")

    existing_email = db.query(ProcurementCenterUser).filter(ProcurementCenterUser.email == data.email.strip().lower()).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered.")

    user = ProcurementCenterUser(
        center_code=data.center_code.strip(),
        center_name=data.center_name.strip(),
        agency=data.agency.strip(),
        location=data.location.strip(),
        inspector_name=data.inspector_name.strip(),
        email=data.email.strip().lower(),
        password_hash=hash_password(data.password)
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/login", response_model=CenterUserResponseSchema)
def login_center(data: CenterLoginSchema, db: Session = Depends(get_db)):
    query_str = data.email_or_code.strip()
    pwd_hash = hash_password(data.password)

    user = db.query(ProcurementCenterUser).filter(
        (ProcurementCenterUser.email == query_str.lower()) | 
        (ProcurementCenterUser.center_code == query_str) |
        (ProcurementCenterUser.center_name == query_str)
    ).first()

    if not user:
        raise HTTPException(status_code=401, detail="Procurement center account not found. Please check credentials or register your center.")

    if user.password_hash != pwd_hash:
        raise HTTPException(status_code=401, detail="Invalid password for procurement center.")

    return user

@router.get("/centers", response_model=List[CenterUserResponseSchema])
def list_centers(db: Session = Depends(get_db)):
    return db.query(ProcurementCenterUser).order_by(ProcurementCenterUser.center_name).all()

def seed_sample_centers(db: Session):
    """Seed initial prototype procurement centers if empty."""
    if db.query(ProcurementCenterUser).count() == 0:
        samples = [
            {
                "center_code": "PC-MH-NSK-01",
                "center_name": "Nashik Main Mandi (NAFED)",
                "agency": "NAFED",
                "location": "Nashik, Maharashtra",
                "inspector_name": "R. K. Sharma",
                "email": "nashik.nafed@oniq.gov.in",
                "password": "password123"
            },
            {
                "center_code": "PC-GJ-MHV-02",
                "center_name": "Mahuva APMC Hub",
                "agency": "APMC Gujarat",
                "location": "Mahuva, Gujarat",
                "inspector_name": "Priya Patel",
                "email": "mahuva.apmc@oniq.gov.in",
                "password": "password123"
            },
            {
                "center_code": "PC-MP-IND-03",
                "center_name": "Indore Central Procurement",
                "agency": "NCCF / MP Mandi Board",
                "location": "Indore, Madhya Pradesh",
                "inspector_name": "Amit Verma",
                "email": "indore.procurement@oniq.gov.in",
                "password": "password123"
            }
        ]

        for s in samples:
            u = ProcurementCenterUser(
                center_code=s["center_code"],
                center_name=s["center_name"],
                agency=s["agency"],
                location=s["location"],
                inspector_name=s["inspector_name"],
                email=s["email"],
                password_hash=hash_password(s["password"])
            )
            db.add(u)
        db.commit()
