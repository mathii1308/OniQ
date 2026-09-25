from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import json
import datetime
import random

from app.database import get_db
from app.models import AssessmentRecord
from app.schemas import AssessmentCreateSchema, AssessmentResponseSchema

router = APIRouter(prefix="/api", tags=["Assessments"])

import os

def generate_assessment_id(db: Session) -> str:
    count = db.query(AssessmentRecord).count() + 1
    return f"ONQ-2026-{count:03d}"

@router.get("/dataset/summary")
def get_dataset_summary():
    report_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dataset_analysis_report.json"))
    if os.path.exists(report_path):
        with open(report_path, "r") as f:
            return json.load(f)
    return {"message": "Dataset report not generated yet.", "total_dataset_images": 16300}

@router.post("/assessments", response_model=AssessmentResponseSchema)
def create_assessment(data: AssessmentCreateSchema, db: Session = Depends(get_db)):
    ass_id = generate_assessment_id(db)
    
    record = AssessmentRecord(
        assessment_id=ass_id,
        batch_id=data.batch_id,
        procurement_center=data.procurement_center,
        inspector_name=data.inspector_name,
        image_url=data.image_url,
        total_visible_onions=data.total_visible_onions,
        healthy_pct=data.healthy_pct,
        damaged_pct=data.damaged_pct,
        rotten_pct=data.rotten_pct,
        sprouted_pct=data.sprouted_pct,
        undersized_pct=data.undersized_pct,
        quality_score=data.quality_score,
        confidence=data.confidence,
        confidence_level=data.confidence_level,
        grade=data.grade,
        status=data.status,
        analysis_mode=data.analysis_mode,
        observations_json=json.dumps(data.observations),
        reasoning=data.reasoning
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    # Parse observations back to list for schema response
    record_dict = record.__dict__
    record_dict["observations"] = json.loads(record.observations_json or "[]")
    return record_dict

@router.get("/assessments", response_model=List[AssessmentResponseSchema])
def list_assessments(
    q: Optional[str] = Query(None, description="Search by Batch ID or Assessment ID"),
    grade: Optional[str] = Query(None, description="Filter by Grade"),
    center: Optional[str] = Query(None, description="Filter by Procurement Center"),
    db: Session = Depends(get_db)
):
    query = db.query(AssessmentRecord)

    if center:
        query = query.filter(AssessmentRecord.procurement_center == center)

    if q:
        search_term = f"%{q.strip()}%"
        query = query.filter(
            (AssessmentRecord.batch_id.ilike(search_term)) |
            (AssessmentRecord.assessment_id.ilike(search_term)) |
            (AssessmentRecord.procurement_center.ilike(search_term))
        )
    
    if grade:
        query = query.filter(AssessmentRecord.grade == grade)

    records = query.order_by(AssessmentRecord.created_at.desc()).all()

    # Process observations_json for list response
    results = []
    for r in records:
        d = r.__dict__.copy()
        d["observations"] = json.loads(r.observations_json or "[]")
        results.append(d)
    return results

@router.get("/assessments/{id_or_code}", response_model=AssessmentResponseSchema)
def get_assessment(id_or_code: str, db: Session = Depends(get_db)):
    record = None
    if id_or_code.isdigit():
        record = db.query(AssessmentRecord).filter(AssessmentRecord.id == int(id_or_code)).first()
    if not record:
        record = db.query(AssessmentRecord).filter(AssessmentRecord.assessment_id == id_or_code.upper()).first()

    if not record:
        raise HTTPException(status_code=404, detail="Assessment record not found.")

    d = record.__dict__.copy()
    d["observations"] = json.loads(record.observations_json or "[]")
    return d

@router.get("/verify/{assessment_id}")
def verify_assessment(assessment_id: str, db: Session = Depends(get_db)):
    record = db.query(AssessmentRecord).filter(AssessmentRecord.assessment_id == assessment_id.upper()).first()

    if not record:
        return {
            "verified": False,
            "message": f"No official assessment record matching ID {assessment_id} was found in the database."
        }

    return {
        "verified": True,
        "assessment_id": record.assessment_id,
        "batch_id": record.batch_id,
        "procurement_center": record.procurement_center,
        "inspector_name": record.inspector_name,
        "date": record.created_at.strftime("%d %b %Y, %H:%M UTC"),
        "quality_score": record.quality_score,
        "grade": record.grade,
        "confidence": record.confidence,
        "status": record.status,
        "analysis_mode": record.analysis_mode,
        "summary": f"{record.grade} quality score {record.quality_score}/100 verified for Batch {record.batch_id} at {record.procurement_center}."
    }

def seed_sample_records(db: Session):
    """Seed initial prototype demo data if database is empty."""
    if db.query(AssessmentRecord).count() == 0:
        samples = [
            {
                "assessment_id": "ONQ-2026-001",
                "batch_id": "BATCH-MH-NASHIK-104",
                "procurement_center": "Nashik Main Mandi (NAFED)",
                "inspector_name": "R. K. Sharma",
                "image_url": "/samples/sample_grade_a.jpg",
                "total_visible_onions": 48,
                "healthy_pct": 82.0,
                "damaged_pct": 8.0,
                "rotten_pct": 2.0,
                "sprouted_pct": 4.0,
                "undersized_pct": 4.0,
                "quality_score": 82,
                "confidence": 94,
                "confidence_level": "HIGH",
                "grade": "GRADE A",
                "status": "Verified",
                "analysis_mode": "Prototype Demo Data",
                "observations": [
                    "Majority of visible onions exhibit firm dry outer skin and vibrant reddish hue.",
                    "Low incidence of surface bruising or mechanical cuts (8%).",
                    "Rotten percentage well within acceptable procurement limits (2%)."
                ],
                "reasoning": "The batch is predominantly healthy with minimal visible surface defects or rot.",
                "created_at": datetime.datetime.utcnow() - datetime.timedelta(hours=4)
            },
            {
                "assessment_id": "ONQ-2026-002",
                "batch_id": "BATCH-GJ-MAHUVA-882",
                "procurement_center": "Mahuva APMC Hub",
                "inspector_name": "Priya Patel",
                "image_url": "/samples/sample_grade_b.jpg",
                "total_visible_onions": 42,
                "healthy_pct": 68.0,
                "damaged_pct": 15.0,
                "rotten_pct": 5.0,
                "sprouted_pct": 7.0,
                "undersized_pct": 5.0,
                "quality_score": 74,
                "confidence": 78,
                "confidence_level": "MODERATE",
                "grade": "GRADE B",
                "status": "Review",
                "analysis_mode": "Prototype Demo Data",
                "observations": [
                    "Moderate skin peeling and visible surface scuffing across batch.",
                    "Sprouting shoots visible on approximately 7% of visible bulbs."
                ],
                "reasoning": "Standard batch quality with acceptable defect proportions for immediate distribution.",
                "created_at": datetime.datetime.utcnow() - datetime.timedelta(days=1)
            },
            {
                "assessment_id": "ONQ-2026-003",
                "batch_id": "BATCH-MP-INDORE-501",
                "procurement_center": "Indore Central Procurement",
                "inspector_name": "Amit Verma",
                "image_url": "/samples/sample_rot_defect.jpg",
                "total_visible_onions": 31,
                "healthy_pct": 52.0,
                "damaged_pct": 20.0,
                "rotten_pct": 12.0,
                "sprouted_pct": 10.0,
                "undersized_pct": 6.0,
                "quality_score": 61,
                "confidence": 54,
                "confidence_level": "LOW",
                "grade": "MANUAL VERIFICATION",
                "status": "Pending",
                "analysis_mode": "Prototype Demo Data",
                "observations": [
                    "High proportion of visible surface soft rot and mold spots (12%).",
                    "Substantial overlap and shadows reduce automated vision confidence."
                ],
                "reasoning": "Automated confidence is below 60%. Manual verification required before assigning final grade.",
                "created_at": datetime.datetime.utcnow() - datetime.timedelta(days=2)
            }
        ]

        for s in samples:
            rec = AssessmentRecord(
                assessment_id=s["assessment_id"],
                batch_id=s["batch_id"],
                procurement_center=s["procurement_center"],
                inspector_name=s["inspector_name"],
                image_url=s["image_url"],
                total_visible_onions=s["total_visible_onions"],
                healthy_pct=s["healthy_pct"],
                damaged_pct=s["damaged_pct"],
                rotten_pct=s["rotten_pct"],
                sprouted_pct=s["sprouted_pct"],
                undersized_pct=s["undersized_pct"],
                quality_score=s["quality_score"],
                confidence=s["confidence"],
                confidence_level=s["confidence_level"],
                grade=s["grade"],
                status=s["status"],
                analysis_mode=s["analysis_mode"],
                observations_json=json.dumps(s["observations"]),
                reasoning=s["reasoning"],
                created_at=s["created_at"]
            )
            db.add(rec)
        db.commit()
