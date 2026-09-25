from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class AnalysisResultSchema(BaseModel):
    total_visible_onions: int
    healthy_pct: float
    damaged_pct: float
    rotten_pct: float
    sprouted_pct: float
    undersized_pct: float
    quality_score: int
    confidence: int
    confidence_level: str
    grade: str
    reasoning: str
    observations: List[str]
    analysis_mode: str
    image_quality: dict
    bounding_boxes: Optional[List[dict]] = []

class AssessmentCreateSchema(BaseModel):
    batch_id: str
    procurement_center: str
    inspector_name: str
    image_url: str
    total_visible_onions: int
    healthy_pct: float
    damaged_pct: float
    rotten_pct: float
    sprouted_pct: float
    undersized_pct: float
    quality_score: int
    confidence: int
    confidence_level: str
    grade: str
    status: str
    analysis_mode: str
    observations: List[str]
    reasoning: str

class AssessmentResponseSchema(BaseModel):
    id: int
    assessment_id: str
    batch_id: str
    procurement_center: str
    inspector_name: str
    image_url: str
    total_visible_onions: int
    healthy_pct: float
    damaged_pct: float
    rotten_pct: float
    sprouted_pct: float
    undersized_pct: float
    quality_score: int
    confidence: int
    confidence_level: str
    grade: str
    status: str
    analysis_mode: str
    observations: List[str]
    reasoning: str
    created_at: datetime

    class Config:
        from_attributes = True

class CenterRegisterSchema(BaseModel):
    center_code: str
    center_name: str
    agency: str
    location: str
    inspector_name: str
    email: str
    password: str

class CenterLoginSchema(BaseModel):
    email_or_code: str
    password: str

class CenterUserResponseSchema(BaseModel):
    id: int
    center_code: str
    center_name: str
    agency: str
    location: str
    inspector_name: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True

