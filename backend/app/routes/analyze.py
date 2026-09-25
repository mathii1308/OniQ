from fastapi import APIRouter, UploadFile, File, HTTPException
import uuid
from pathlib import Path
from app.config import UPLOADS_DIR
from app.services.image_service import evaluate_image_quality
from app.services.ai_service import analyze_onion_image

router = APIRouter(prefix="/api", tags=["Analysis"])

@router.post("/analyze")
async def analyze_batch(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be a valid image.")

    content = await file.read()
    if len(content) > 15 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image file exceeds 15MB size limit.")

    # Step 1: Image Quality & Onion Relevance pre-check
    quality_info = evaluate_image_quality(content)

    if not quality_info.get("is_suitable", True):
        raise HTTPException(
            status_code=400,
            detail=f"IMAGE REJECTED: {quality_info['message']}"
        )

    # Save uploaded file
    file_ext = Path(file.filename).suffix or ".jpg"
    unique_filename = f"batch_{uuid.uuid4().hex[:10]}{file_ext}"
    saved_path = UPLOADS_DIR / unique_filename
    
    with open(saved_path, "wb") as f:
        f.write(content)

    image_url = f"/uploads/{unique_filename}"

    # Step 2: AI / Demo Vision Analysis
    analysis_res = analyze_onion_image(content, filename=file.filename)
    analysis_res["image_url"] = image_url
    analysis_res["image_quality"] = quality_info

    return analysis_res
