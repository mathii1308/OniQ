from app.config import GRADING_RULES

def calculate_grade_and_score(healthy: float, damaged: float, rotten: float, sprouted: float, undersized: float, confidence: int):
    """
    Standardized grading engine based on defect percentages and confidence.
    Enforces Confidence-Aware Logic and strict safety caps for rot defects.
    - If confidence < 60: Grade is "MANUAL VERIFICATION REQUIRED"
    - If rotten >= 15% or healthy < 40%: REJECT / NON-COMPLIANT
    - Strict score penalty on rot (rot is infectious in procurement)
    """
    # Calculate weighted overall quality score (0 - 100)
    # Healthy contributes +1.0, damaged -0.4, sprouted -0.3, undersized -0.2, rotten heavily penalized (-2.5)
    raw_score = (healthy * 1.0) - (rotten * 2.5) - (damaged * 0.4) - (sprouted * 0.3) - (undersized * 0.2)
    quality_score = max(0, min(100, int(round(raw_score))))

    # Enforce strict maximum score caps based on rot severity
    if rotten >= 20.0:
        quality_score = min(quality_score, 25)
    elif rotten >= 10.0:
        quality_score = min(quality_score, 48)
    elif rotten >= 5.0:
        quality_score = min(quality_score, 68)

    # Determine confidence level
    if confidence >= 80:
        confidence_level = "HIGH"
    elif confidence >= 60:
        confidence_level = "MODERATE"
    else:
        confidence_level = "LOW"

    # Grading logic
    if confidence < 60:
        grade = "MANUAL VERIFICATION"
        reasoning = "Automated confidence is below 60%. Manual verification required before assigning final grade."
    elif rotten >= 15.0 or healthy < 40.0:
        grade = "REJECT / NON-COMPLIANT"
        reasoning = f"Severe rot level ({rotten}%) or low healthy bulb percentage ({healthy}%) exceeds permissible procurement standards."
    elif rotten > GRADING_RULES["GRADE_B"]["max_rotten"]: # > 10%
        grade = "GRADE C"
        reasoning = f"Elevated surface rot/decay ({rotten}%) limits batch to commercial grade processing."
    elif rotten > GRADING_RULES["GRADE_A"]["max_rotten"]: # > 5%
        grade = "GRADE B"
        reasoning = f"Acceptable batch quality with moderate defect levels ({rotten}% rot)."
    elif healthy >= GRADING_RULES["GRADE_A"]["min_healthy"] and rotten <= GRADING_RULES["GRADE_A"]["max_rotten"] and sprouted <= GRADING_RULES["GRADE_A"]["max_sprouted"]:
        grade = "GRADE A"
        reasoning = "The batch is predominantly healthy with minimal visible surface defects or rot."
    elif healthy >= GRADING_RULES["GRADE_B"]["min_healthy"] and rotten <= GRADING_RULES["GRADE_B"]["max_rotten"]:
        grade = "GRADE B"
        reasoning = "Standard batch quality with acceptable defect proportions for immediate distribution."
    elif healthy >= GRADING_RULES["GRADE_C"]["min_healthy"]:
        grade = "GRADE C"
        reasoning = "Commercial grade with higher proportion of visible physical imperfections or sprouting."
    else:
        grade = "REJECT / NON-COMPLIANT"
        reasoning = "Excessive visible damage or rot detected exceeding permissible procurement standards."

    return {
        "quality_score": quality_score,
        "grade": grade,
        "confidence_level": confidence_level,
        "reasoning": reasoning
    }

