import os
import sys
import json
import random
import datetime

# Add project root to Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.database import SessionLocal, engine, Base
from app.models import AssessmentRecord, ProcurementCenterUser
from app.services.ai_service import _generate_demo_analysis

DATASET_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "DATASET"))

def main():
    print("=" * 70)
    print("OniQ Dataset Processor & Bulk Grading Engine")
    print(f"Dataset Location: {DATASET_DIR}")
    print("=" * 70)

    if not os.path.exists(DATASET_DIR):
        print(f"Error: DATASET directory not found at {DATASET_DIR}")
        return

    category_stats = {}
    total_images_found = 0
    all_records = []

    # Walk through dataset directory
    for root, dirs, files in os.walk(DATASET_DIR):
        img_files = [f for f in files if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
        if img_files:
            rel_path = os.path.relpath(root, DATASET_DIR)
            count = len(img_files)
            category_stats[rel_path] = count
            total_images_found += count

    print(f"\n[+] Found total {total_images_found:,} images across {len(category_stats)} dataset folders.\n")

    # Sample images from each category for initial DB seeding & report generation
    procurement_centers = [
        {"center": "Nashik Main Mandi (NAFED)", "officer": "R. K. Sharma"},
        {"center": "Mahuva APMC Hub", "officer": "Priya Patel"},
        {"center": "Indore Central Procurement", "officer": "Amit Verma"},
        {"center": "Lasalgaon Sub-Market", "officer": "S. V. Kulkarni"}
    ]

    db = SessionLocal()
    try:
        # Clear old seeded records if needed or add new
        existing_count = db.query(AssessmentRecord).count()
        print(f"Existing DB assessment records: {existing_count}")

        assessment_counter = existing_count + 1
        processed_samples = 0

        for rel_path, img_count in category_stats.items():
            folder_path = os.path.join(DATASET_DIR, rel_path)
            img_files = [f for f in os.listdir(folder_path) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]

            # Pick 2-3 sample images per category folder to seed rich database records
            sample_files = img_files[:3]

            is_healthy = "healthy" in rel_path.lower() and "unhealthy" not in rel_path.lower()
            is_white = "white onion" in rel_path.lower()
            is_red = "red onion" in rel_path.lower()
            is_leaf = "leaves" in rel_path.lower()

            for fname in sample_files:
                fpath = os.path.join(folder_path, fname)
                try:
                    with open(fpath, "rb") as f:
                        img_bytes = f.read()
                    
                    # Run computer vision analysis engine
                    analysis = _generate_demo_analysis(img_bytes, filename=f"{rel_path}_{fname}")
                    
                    center_info = random.choice(procurement_centers)
                    ass_id = f"ONQ-2026-{assessment_counter:03d}"
                    batch_id = f"BATCH-DS-{assessment_counter:03d}"
                    assessment_counter += 1

                    rec = AssessmentRecord(
                        assessment_id=ass_id,
                        batch_id=batch_id,
                        procurement_center=center_info["center"],
                        inspector_name=center_info["officer"],
                        image_url="https://images.unsplash.com/photo-1618512496248-a07fe83aa8ce?auto=format&fit=crop&w=600&q=80" if is_healthy else "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80",
                        total_visible_onions=analysis["total_visible_onions"],
                        healthy_pct=analysis["healthy_pct"],
                        damaged_pct=analysis["damaged_pct"],
                        rotten_pct=analysis["rotten_pct"],
                        sprouted_pct=analysis["sprouted_pct"],
                        undersized_pct=analysis["undersized_pct"],
                        quality_score=analysis["quality_score"],
                        confidence=analysis["confidence"],
                        confidence_level=analysis["confidence_level"],
                        grade=analysis["grade"],
                        status="Verified" if analysis["grade"] == "GRADE A" else ("Review" if analysis["grade"] == "GRADE B" else "Pending"),
                        analysis_mode=f"Dataset Vision ({rel_path})",
                        observations_json=json.dumps(analysis["observations"]),
                        reasoning=analysis["reasoning"],
                        created_at=datetime.datetime.utcnow() - datetime.timedelta(hours=random.randint(1, 72))
                    )

                    db.add(rec)
                    all_records.append({
                        "assessment_id": ass_id,
                        "batch_id": batch_id,
                        "folder": rel_path,
                        "filename": fname,
                        "quality_score": analysis["quality_score"],
                        "grade": analysis["grade"],
                        "healthy_pct": analysis["healthy_pct"],
                        "rotten_pct": analysis["rotten_pct"]
                    })
                    processed_samples += 1

                except Exception as ex:
                    print(f"Error processing {fname}: {ex}")

        db.commit()
        print(f"[+] Successfully processed and inserted {processed_samples} dataset sample records into database.")

        # Generate JSON Analysis Summary Report
        report_data = {
            "dataset_name": "OniQ Multi-Class Onion & Leaf Quality Dataset",
            "total_dataset_images": total_images_found,
            "processed_at": datetime.datetime.now().isoformat(),
            "category_distribution": category_stats,
            "sample_assessments": all_records,
            "summary": {
                "healthy_batches_avg_score": round(sum(r["quality_score"] for r in all_records if "GRADE A" in r["grade"]) / max(1, len([r for r in all_records if "GRADE A" in r["grade"]])), 1),
                "unhealthy_batches_avg_score": round(sum(r["quality_score"] for r in all_records if "REJECT" in r["grade"]) / max(1, len([r for r in all_records if "REJECT" in r["grade"]])), 1),
                "grade_a_count": len([r for r in all_records if "GRADE A" in r["grade"]]),
                "reject_count": len([r for r in all_records if "REJECT" in r["grade"]])
            }
        }

        report_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "app", "dataset_analysis_report.json"))
        with open(report_path, "w") as rf:
            json.dump(report_data, rf, indent=2)

        print(f"[+] Saved Dataset Quality Analysis Report to {report_path}")
        print("\nSummary Analytics:")
        print(f"  • Fresh / Healthy Batches Average Score: {report_data['summary']['healthy_batches_avg_score']} / 100 (GRADE A)")
        print(f"  • Unhealthy / Rotten Batches Average Score: {report_data['summary']['unhealthy_batches_avg_score']} / 100 (REJECT / NON-COMPLIANT)")
        print("=" * 70)

    finally:
        db.close()

if __name__ == "__main__":
    main()
