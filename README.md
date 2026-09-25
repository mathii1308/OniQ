# OniQ — Intelligent Onion Quality Assessment

**Smart India Hackathon 2026 Prototype**  
**Problem Statement ID:** 26031  
**Theme:** Smart Automation  
**Category:** Software  

---

## 📌 Problem Statement

> “Quality assessment and grading of onions are often subjective and vary across procurement centers, resulting in disputes and inconsistencies.”

Onion procurement across agricultural mandis and government centers (like NAFED / APMC) often suffers from manual, subjective evaluation. Inspectors apply varying visual standards, leading to dispute overhead, farmer dissatisfaction, and pricing mismatches.

**OniQ** provides a standardized, explainable, and traceable computer-vision assessment framework designed to reduce subjectivity and provide evidence-backed grading records.

---

## 🚀 Key Features

1. **Procurement Quality Dashboard**: Real-time monitoring of batch metrics, average quality scores, grade distributions, and pending verifications.
2. **Image Quality Validation**: Fast computer-vision pre-check (checking blur via Laplacian variance, brightness, and resolution) before AI analysis to guarantee reliable results.
3. **AI Vision & Demo Dual Mode**:
   - **AI Vision Analysis Mode**: Utilizes Google Gemini Multimodal Vision API when `GEMINI_API_KEY` is present.
   - **Demo Analysis Mode**: Executes realistic, deterministic simulated analysis when no key is set or when offline.
4. **Confidence-Aware Decision Logic**:
   - **High Confidence (≥ 80%)**: Automated grading proceeds automatically.
   - **Moderate Confidence (60% - 79%)**: Prompts operator review of visual evidence overlay.
   - **Low Confidence (< 60%)**: Pauses automated grading; requires manual verification or image retake.
5. **Explainable Assessment ("Why this result?")**: Clear rule-based evidence breakdown explaining defect percentages and justification.
6. **Visual Evidence Overlay**: Renders bounding boxes highlighting detected healthy bulbs and surface defects.
7. **Digital Quality Report**: Print-optimized quality certificate with complete metrics and an embedded QR verification code.
8. **QR Code Traceability & Verification**: Public verification ledger to verify batch record authenticity.

---

## 🛠 Tech Stack

- **Frontend**: React, Vite, Custom CSS (Government/Agri-tech procurement theme: Dark Navy `#0F172A`, Crisp White `#F8FAFC`, Emerald Green `#059669`), Lucide Icons, QR Code SVG generator.
- **Backend**: Python 3.10+, FastAPI, SQLAlchemy, SQLite Database.
- **Computer Vision & AI**: OpenCV (`opencv-python-headless`), Pillow (`PIL`), Google GenAI SDK (`google-genai`).

---

## 📁 Repository Structure

```
oniq/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry point & routes mounting
│   │   ├── config.py            # Environment configuration & grading rules
│   │   ├── database.py          # SQLite database connection
│   │   ├── models.py            # AssessmentRecord database schema
│   │   ├── schemas.py           # Pydantic request/response schemas
│   │   ├── routes/
│   │   │   ├── analyze.py       # Image upload & vision analysis endpoint
│   │   │   └── assessments.py   # Assessment CRUD & verification endpoint
│   │   └── services/
│   │       ├── ai_service.py    # Gemini vision API & fallback demo generator
│   │       ├── image_service.py # OpenCV blur/brightness image validator
│   │       └── grading_service.py # Standardized grading engine
│   ├── uploads/                 # Uploaded batch image storage
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Dashboard, NewAssessment, Result, Report, History, Verification
│   │   ├── services/            # API client with offline fallback
│   │   ├── index.css            # Custom CSS styling tokens
│   │   └── App.jsx              # Main routing & state controller
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── README.md
├── .env.example
└── .env
```

---

## ⚙️ Installation & Running Locally

### 1. Backend Setup (FastAPI)

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend runs at `http://localhost:8000`.  
API documentation: `http://localhost:8000/docs`

### 2. Frontend Setup (React / Vite)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend runs at `http://localhost:5173`.

---

## 🔑 Environment Variables & AI Setup

Create a `.env` file in the root directory (refer to `.env.example`):

```env
# Optional: Set your Gemini API Key to enable AI Vision Analysis Mode
GEMINI_API_KEY=your_gemini_api_key_here

PORT=8000
HOST=0.0.0.0
DATABASE_URL=sqlite:///./oniq.db
```

- **If `GEMINI_API_KEY` is provided**: OniQ sends images to Google Gemini Multimodal Vision API for visual analysis.
- **If `GEMINI_API_KEY` is omitted**: OniQ automatically runs in **Demo Analysis Mode**, generating realistic simulated data suitable for live hackathon demonstrations.

---

## 🔌 API Endpoints Summary

- `GET /api/health` - Server health, active mode, and Gemini API configuration status.
- `POST /api/analyze` - Upload image, perform image quality validation, execute vision analysis.
- `POST /api/assessments` - Save completed quality assessment record to SQLite.
- `GET /api/assessments` - Fetch assessment history (supports search `q` and filter `grade`).
- `GET /api/assessments/{id}` - Fetch assessment details by ID or Assessment Code.
- `GET /api/verify/{assessment_id}` - Verify digital assessment record.

---

## ⚠️ Prototype Limitations Disclaimer

To maintain technical credibility during SIH 2026 evaluation:

1. **Visible Surface Characteristics**: Image-based vision analysis primarily addresses visible surface features (outer skin scale condition, mechanical cuts, visible rot spots, sprouting shoots). Internal rot/defects cannot be determined from standard RGB images without spectroscopic/hyperspectral sensors.
2. **Relative Sizing**: Physical bulb size estimation is relative ("visually undersized relative to batch sample") unless a calibrated physical scale object is present in the frame.
3. **Configurable Grading Criteria**: Prototype grading thresholds must be validated and tuned against official APMC/NAFED procurement specifications before live deployment.

---

## 🗺️ Future Production Roadmap

- **Phase 1 (Completed)**: Functional SIH 2026 prototype with confidence-aware grading, printable digital reports, and QR verification.
- **Phase 2**: Dataset Curation — Build an annotated dataset of regional Indian onion varieties (Nasik Red, Mahuva White, Agri-Found Dark Red).
- **Phase 3**: Model Training — Train edge-optimized object detection models (YOLOv8-Seg / MobileNet Vision) for offline hardware deployment at Mandis.
- **Phase 4**: Standards Calibration — Validate grading rules with NAFED, NCCF, and APMC agricultural quality officers.
- **Phase 5**: Field Pilot — Pilot digital assessment kiosks across select Maharashtra and Gujarat procurement centers.
- **Phase 6**: National Rollout — Scale to multi-center procurement hubs with centralized dashboard reporting.
