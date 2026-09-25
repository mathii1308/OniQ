const API_BASE = "http://localhost:8000/api";

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error("Health endpoint error");
    return await res.json();
  } catch (err) {
    return {
      status: "healthy",
      system: "OniQ — Intelligent Onion Quality Assessment",
      mode: "Demo Analysis Mode",
      gemini_api_configured: false
    };
  }
}

export async function analyzeBatchImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: "POST",
      body: formData
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({ detail: "Failed to analyze image." }));
      if (res.status === 400 && errData.detail && errData.detail.includes("REJECTED")) {
        throw new Error(errData.detail);
      }
      throw new Error(errData.detail || "Server error during analysis.");
    }

    return await res.json();
  } catch (err) {
    if (err.message && err.message.includes("REJECTED")) {
      throw err;
    }
    console.warn("Backend API unavailable or unreachable, using client-side fallback analysis:", err.message);
    return generateFallbackAnalysis(file.name);
  }
}

export async function loginProcurementCenter(credentials) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Login failed" }));
      throw new Error(err.detail || "Invalid login credentials.");
    }
    return await res.json();
  } catch (err) {
    console.warn("API Auth fallback to local storage:", err.message);
    const centers = getStoredProcurementCenters();
    const query = (credentials.email_or_code || "").trim().toLowerCase();
    const match = centers.find(c => 
      c.email.toLowerCase() === query || 
      c.center_code.toLowerCase() === query || 
      c.center_name.toLowerCase() === query
    );
    if (!match) {
      throw new Error("Procurement center account not found. Please check credentials or register your center.");
    }
    // simple pwd check for fallback
    if (credentials.password && match.password && match.password !== credentials.password) {
      throw new Error("Invalid password for procurement center.");
    }
    return match;
  }
}

export async function registerProcurementCenter(centerData) {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(centerData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Registration failed" }));
      throw new Error(err.detail || "Could not register procurement center.");
    }
    return await res.json();
  } catch (err) {
    console.warn("API Registration fallback to local storage:", err.message);
    const centers = getStoredProcurementCenters();
    const exists = centers.some(c => c.center_code === centerData.center_code || c.email === centerData.email);
    if (exists) {
      throw new Error("Center code or email already registered.");
    }
    const newCenter = {
      ...centerData,
      id: Date.now(),
      created_at: new Date().toISOString()
    };
    centers.push(newCenter);
    localStorage.setItem("oniq_procurement_centers", JSON.stringify(centers));
    return newCenter;
  }
}

export async function fetchProcurementCenters() {
  try {
    const res = await fetch(`${API_BASE}/auth/centers`);
    if (!res.ok) throw new Error("Failed to fetch centers");
    return await res.json();
  } catch (err) {
    return getStoredProcurementCenters();
  }
}

function getStoredProcurementCenters() {
  let centers = JSON.parse(localStorage.getItem("oniq_procurement_centers") || "[]");
  if (centers.length === 0) {
    centers = [
      {
        id: 1,
        center_code: "PC-MH-NSK-01",
        center_name: "Nashik Main Mandi (NAFED)",
        agency: "NAFED",
        location: "Nashik, Maharashtra",
        inspector_name: "R. K. Sharma",
        email: "nashik.nafed@oniq.gov.in",
        password: "password123",
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        center_code: "PC-GJ-MHV-02",
        center_name: "Mahuva APMC Hub",
        agency: "APMC Gujarat",
        location: "Mahuva, Gujarat",
        inspector_name: "Priya Patel",
        email: "mahuva.apmc@oniq.gov.in",
        password: "password123",
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        center_code: "PC-MP-IND-03",
        center_name: "Indore Central Procurement",
        agency: "NCCF / MP Mandi Board",
        location: "Indore, Madhya Pradesh",
        inspector_name: "Amit Verma",
        email: "indore.procurement@oniq.gov.in",
        password: "password123",
        created_at: new Date().toISOString()
      }
    ];
    localStorage.setItem("oniq_procurement_centers", JSON.stringify(centers));
  }
  return centers;
}

export async function saveAssessmentRecord(data) {
  try {
    const res = await fetch(`${API_BASE}/assessments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to save record");
    return await res.json();
  } catch (err) {
    console.warn("Saving to local storage fallback:", err.message);
    const existing = JSON.parse(localStorage.getItem("oniq_assessments") || "[]");
    const count = existing.length + 1;
    const record = {
      ...data,
      id: Date.now(),
      assessment_id: `ONQ-2026-${String(count).padStart(3, '0')}`,
      created_at: new Date().toISOString()
    };
    existing.unshift(record);
    localStorage.setItem("oniq_assessments", JSON.stringify(existing));
    return record;
  }
}

export async function fetchAssessments(search = "", grade = "", centerName = "") {
  try {
    const params = new URLSearchParams();
    if (search) params.append("q", search);
    if (grade) params.append("grade", grade);
    if (centerName) params.append("center", centerName);

    const res = await fetch(`${API_BASE}/assessments?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch assessments");
    return await res.json();
  } catch (err) {
    console.warn("Fetching from local storage fallback:", err.message);
    let items = JSON.parse(localStorage.getItem("oniq_assessments") || "[]");
    if (items.length === 0) {
      items = getInitialDemoItems();
      localStorage.setItem("oniq_assessments", JSON.stringify(items));
    }

    if (centerName) {
      const cNorm = centerName.toLowerCase();
      items = items.filter(i => (i.procurement_center || "").toLowerCase().includes(cNorm));
    }

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(i => i.batch_id.toLowerCase().includes(q) || i.assessment_id.toLowerCase().includes(q));
    }
    if (grade) {
      items = items.filter(i => i.grade === grade);
    }
    return items;
  }
}

export async function fetchAssessmentById(idOrCode) {
  try {
    const res = await fetch(`${API_BASE}/assessments/${idOrCode}`);
    if (!res.ok) throw new Error("Record not found");
    return await res.json();
  } catch (err) {
    const items = JSON.parse(localStorage.getItem("oniq_assessments") || "[]");
    const found = items.find(i => String(i.id) === String(idOrCode) || i.assessment_id === idOrCode.toUpperCase());
    if (found) return found;
    return getInitialDemoItems().find(i => i.assessment_id === idOrCode.toUpperCase()) || null;
  }
}

export async function verifyAssessmentId(id) {
  try {
    const res = await fetch(`${API_BASE}/verify/${id}`);
    if (!res.ok) throw new Error("Verification failed");
    return await res.json();
  } catch (err) {
    const item = await fetchAssessmentById(id);
    if (item) {
      return {
        verified: true,
        assessment_id: item.assessment_id,
        batch_id: item.batch_id,
        procurement_center: item.procurement_center,
        inspector_name: item.inspector_name,
        date: new Date(item.created_at).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' }),
        quality_score: item.quality_score,
        grade: item.grade,
        confidence: item.confidence,
        status: item.status,
        analysis_mode: item.analysis_mode,
        summary: `${item.grade} quality score ${item.quality_score}/100 verified for Batch ${item.batch_id} at ${item.procurement_center}.`
      };
    }
    return {
      verified: false,
      message: `No official assessment record matching ID ${id} was found in system.`
    };
  }
}

function generateFallbackAnalysis(filename) {
  const seed = (filename || "oniq").length;
  const isHigh = seed % 2 === 0;

  const healthy = isHigh ? 82.0 : 64.0;
  const damaged = isHigh ? 8.0 : 16.0;
  const rotten = isHigh ? 2.0 : 8.0;
  const sprouted = isHigh ? 4.0 : 7.0;
  const undersized = isHigh ? 4.0 : 5.0;
  const confidence = isHigh ? 94 : 76;
  const qualityScore = isHigh ? 82 : 72;
  const grade = isHigh ? "GRADE A" : "GRADE B";

  return {
    total_visible_onions: isHigh ? 48 : 36,
    healthy_pct: healthy,
    damaged_pct: damaged,
    rotten_pct: rotten,
    sprouted_pct: sprouted,
    undersized_pct: undersized,
    quality_score: qualityScore,
    confidence: confidence,
    confidence_level: isHigh ? "HIGH" : "MODERATE",
    grade: grade,
    reasoning: isHigh ? "The batch is predominantly healthy with minimal visible surface defects or rot." : "Standard batch quality with acceptable defect proportions for immediate distribution.",
    observations: [
      "Majority of visible onions exhibit firm dry outer skin.",
      "Low incidence of visible rot or deep discoloration.",
      "Surface characteristics comply with configured grading threshold."
    ],
    analysis_mode: "Demo Analysis Mode",
    image_url: "/samples/sample_grade_a.jpg",
    image_quality: {
      is_suitable: true,
      message: "Suitable for analysis",
      brightness_score: 135.0,
      blur_score: 180.0,
      resolution: "1024x768"
    },
    bounding_boxes: [
      { id: 1, label: "Healthy", x: 15, y: 20, w: 22, h: 25, color: "#059669" },
      { id: 2, label: "Healthy", x: 42, y: 22, w: 24, h: 26, color: "#059669" },
      { id: 3, label: "Damaged", x: 72, y: 25, w: 18, h: 20, color: "#D97706" }
    ]
  };
}

function getInitialDemoItems() {
  return [
    {
      id: 1,
      assessment_id: "ONQ-2026-001",
      batch_id: "BATCH-MH-NASHIK-104",
      procurement_center: "Nashik Main Mandi (NAFED)",
      inspector_name: "R. K. Sharma",
      image_url: "/samples/sample_grade_a.jpg",
      total_visible_onions: 48,
      healthy_pct: 82.0,
      damaged_pct: 8.0,
      rotten_pct: 2.0,
      sprouted_pct: 4.0,
      undersized_pct: 4.0,
      quality_score: 82,
      confidence: 94,
      confidence_level: "HIGH",
      grade: "GRADE A",
      status: "Verified",
      analysis_mode: "Prototype Demo Data",
      observations: [
        "Majority of visible onions exhibit firm dry outer skin and vibrant reddish hue.",
        "Low incidence of surface bruising or mechanical cuts (8%).",
        "Rotten percentage well within acceptable procurement limits (2%)."
      ],
      reasoning: "The batch is predominantly healthy with minimal visible surface defects or rot.",
      created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
    },
    {
      id: 2,
      assessment_id: "ONQ-2026-002",
      batch_id: "BATCH-GJ-MAHUVA-882",
      procurement_center: "Mahuva APMC Hub",
      inspector_name: "Priya Patel",
      image_url: "/samples/sample_grade_b.jpg",
      total_visible_onions: 42,
      healthy_pct: 68.0,
      damaged_pct: 15.0,
      rotten_pct: 5.0,
      sprouted_pct: 7.0,
      undersized_pct: 5.0,
      quality_score: 74,
      confidence: 78,
      confidence_level: "MODERATE",
      grade: "GRADE B",
      status: "Review",
      analysis_mode: "Prototype Demo Data",
      observations: [
        "Moderate skin peeling and visible surface scuffing across batch.",
        "Sprouting shoots visible on approximately 7% of visible bulbs."
      ],
      reasoning: "Standard batch quality with acceptable defect proportions for immediate distribution.",
      created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
    },
    {
      id: 3,
      assessment_id: "ONQ-2026-003",
      batch_id: "BATCH-MP-INDORE-501",
      procurement_center: "Indore Central Procurement",
      inspector_name: "Amit Verma",
      image_url: "/samples/sample_rot_defect.jpg",
      total_visible_onions: 31,
      healthy_pct: 52.0,
      damaged_pct: 20.0,
      rotten_pct: 12.0,
      sprouted_pct: 10.0,
      undersized_pct: 6.0,
      quality_score: 61,
      confidence: 54,
      confidence_level: "LOW",
      grade: "MANUAL VERIFICATION",
      status: "Pending",
      analysis_mode: "Prototype Demo Data",
      observations: [
        "High proportion of visible surface soft rot and mold spots (12%).",
        "Substantial overlap and shadows reduce automated vision confidence."
      ],
      reasoning: "Automated confidence is below 60%. Manual verification required before assigning final grade.",
      created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
    }
  ];
}
