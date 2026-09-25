import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from app.database import Base

class AssessmentRecord(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(String, unique=True, index=True, nullable=False)
    batch_id = Column(String, index=True, nullable=False)
    procurement_center = Column(String, nullable=False)
    inspector_name = Column(String, nullable=False)
    image_url = Column(String, nullable=False)
    
    total_visible_onions = Column(Integer, default=0)
    healthy_pct = Column(Float, default=0.0)
    damaged_pct = Column(Float, default=0.0)
    rotten_pct = Column(Float, default=0.0)
    sprouted_pct = Column(Float, default=0.0)
    undersized_pct = Column(Float, default=0.0)
    
    quality_score = Column(Integer, nullable=False)
    confidence = Column(Integer, nullable=False)
    confidence_level = Column(String, nullable=False) # HIGH / MODERATE / LOW
    grade = Column(String, nullable=False)             # GRADE A / GRADE B / GRADE C / REJECT
    status = Column(String, default="Verified")        # Verified / Review / Pending
    
    analysis_mode = Column(String, default="AI Vision Analysis") # AI Vision Analysis vs Demo Analysis Mode
    observations_json = Column(Text, nullable=True)             # JSON list of strings
    reasoning = Column(Text, nullable=True)                     # Text justification
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ProcurementCenterUser(Base):
    __tablename__ = "procurement_centers"

    id = Column(Integer, primary_key=True, index=True)
    center_code = Column(String, unique=True, index=True, nullable=False)
    center_name = Column(String, nullable=False)
    agency = Column(String, nullable=False) # NAFED, NCCF, APMC, etc.
    location = Column(String, nullable=False)
    inspector_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

