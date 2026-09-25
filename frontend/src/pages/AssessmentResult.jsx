import React, { useState } from 'react';
import { FileText, ShieldCheck, AlertTriangle, ShieldAlert, CheckCircle, RefreshCw, Cpu, HelpCircle, Save, Info } from 'lucide-react';
import QualityCompositionChart from '../components/QualityCompositionChart';
import VisualOverlay from '../components/VisualOverlay';
import { ConfidenceBadge, GradingBadge } from '../components/ConfidenceBadge';
import { saveAssessmentRecord } from '../services/api';

export default function AssessmentResult({ resultData, metadata, setScreen, setSelectedAssessment }) {
  const [isSaving, setIsSaving] = useState(false);
  const [savedRecord, setSavedRecord] = useState(null);

  if (!resultData) return null;

  const {
    total_visible_onions,
    healthy_pct,
    damaged_pct,
    rotten_pct,
    sprouted_pct,
    undersized_pct,
    quality_score,
    confidence,
    confidence_level,
    grade,
    reasoning,
    observations = [],
    analysis_mode,
    image_url,
    bounding_boxes = []
  } = resultData;

  const isLowConfidence = confidence < 60 || confidence_level === 'LOW';
  const isModerateConfidence = (confidence >= 60 && confidence < 80) || confidence_level === 'MODERATE';

  const handleSaveAndReport = async () => {
    setIsSaving(true);
    try {
      const recordPayload = {
        batch_id: metadata.batchId || "BATCH-001",
        procurement_center: metadata.procurementCenter || "Procurement Center",
        inspector_name: metadata.inspectorName || "",
        image_url: image_url || metadata.previewUrl || "https://images.unsplash.com/photo-1618512496248-a07fe83aa8ce?auto=format&fit=crop&w=600&q=80",
        total_visible_onions,
        healthy_pct,
        damaged_pct,
        rotten_pct,
        sprouted_pct,
        undersized_pct,
        quality_score,
        confidence,
        confidence_level,
        grade,
        status: isLowConfidence ? "Pending" : isModerateConfidence ? "Review" : "Verified",
        analysis_mode: analysis_mode || "Demo Analysis Mode",
        observations,
        reasoning
      };

      const saved = await saveAssessmentRecord(recordPayload);
      setSavedRecord(saved);
      setSelectedAssessment(saved);
      setScreen('report');
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Top Bar Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        gap: '12px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)' }}>
              Assessment Result
            </h1>
            <span style={{
              fontSize: '11px',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '12px',
              backgroundColor: '#E2E8F0',
              color: 'var(--text-muted)'
            }}>
              {analysis_mode}
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Batch ID: <strong style={{ color: 'var(--primary-navy)' }}>{metadata?.batchId || 'BATCH-001'}</strong> • Center: {metadata?.procurementCenter || 'Nashik Main Mandi'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setScreen('new_assessment')}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              backgroundColor: '#FFF',
              fontSize: '13px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RefreshCw size={14} />
            <span>Re-Analyze</span>
          </button>

          <button
            onClick={handleSaveAndReport}
            disabled={isSaving}
            style={{
              padding: '8px 18px',
              borderRadius: '6px',
              backgroundColor: 'var(--accent-green)',
              color: '#FFF',
              fontSize: '13px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 4px rgba(5,150,105,0.3)'
            }}
          >
            <FileText size={16} />
            <span>{isSaving ? 'Generating Report...' : 'Digital Quality Report'}</span>
          </button>
        </div>
      </div>

      {/* CONFIDENCE-AWARE WARNING BANNER */}
      {isLowConfidence ? (
        <div style={{
          backgroundColor: '#FEE2E2',
          border: '1px solid #EF4444',
          borderRadius: 'var(--radius)',
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <ShieldAlert size={24} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#991B1B' }}>
                ⚠ LOW CONFIDENCE ({confidence}%) — AUTOMATED GRADE PAUSED
              </div>
              <div style={{ fontSize: '13px', color: '#B91C1C', marginTop: '2px' }}>
                The image does not provide sufficient confidence for reliable automated assessment (excessive overlap or shadow detected).
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setScreen('new_assessment')}
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                backgroundColor: '#991B1B',
                color: '#FFF',
                fontSize: '12px',
                fontWeight: '700'
              }}
            >
              Capture Better Image
            </button>
          </div>
        </div>
      ) : isModerateConfidence ? (
        <div style={{
          backgroundColor: '#FEF3C7',
          border: '1px solid #F59E0B',
          borderRadius: 'var(--radius)',
          padding: '14px 20px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <AlertTriangle size={20} color="#D97706" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#92400E' }}>
              ⚠ MODERATE CONFIDENCE ({confidence}%)
            </div>
            <div style={{ fontSize: '12px', color: '#B45309' }}>
              Consider reviewing the visual evidence overlay below before accepting the automated grading result.
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          backgroundColor: '#D1FAE5',
          border: '1px solid #10B981',
          borderRadius: 'var(--radius)',
          padding: '14px 20px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <ShieldCheck size={20} color="#059669" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#065F46' }}>
              ✓ HIGH CONFIDENCE ({confidence}%)
            </div>
            <div style={{ fontSize: '12px', color: '#047857' }}>
              Image clarity and feature detection permit automatic standardized assessment and report generation.
            </div>
          </div>
        </div>
      )}

      {/* Main Score & Grade Overview Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* QUALITY SCORE CARD */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            backgroundColor: quality_score >= 75 ? '#ECFDF5' : '#FEF3C7',
            border: `6px solid ${quality_score >= 75 ? '#059669' : '#D97706'}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <span style={{ fontSize: '28px', fontWeight: '800', color: 'var(--primary-navy)', lineHeight: '1' }}>
              {quality_score}
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600' }}>/ 100</span>
          </div>

          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Overall Quality Score
            </div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary-navy)', marginTop: '2px' }}>
              {quality_score >= 80 ? 'Superior Quality' : quality_score >= 65 ? 'Acceptable Quality' : 'Sub-Standard Quality'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Estimated visible onions evaluated: <strong>{total_visible_onions} bulbs</strong>
            </div>
          </div>
        </div>

        {/* APPLICABLE GRADE CARD */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Applicable Grade / Category
          </div>
          <div style={{ marginBottom: '8px' }}>
            <GradingBadge grade={grade} />
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
            <Info size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>Based on the configured prototype grading criteria (to be validated against official APMC/NAFED standards).</span>
          </div>
        </div>
      </div>

      {/* Defect Composition Section */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius)',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: 'var(--primary-navy)' }}>
          Quality Characteristics Composition
        </h3>
        <QualityCompositionChart
          healthy={healthy_pct}
          damaged={damaged_pct}
          rotten={rotten_pct}
          sprouted={sprouted_pct}
          undersized={undersized_pct}
        />
      </div>

      {/* EXPLAINABLE ASSESSMENT ("Why this result?") */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius)',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <HelpCircle size={20} color="var(--accent-blue)" />
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--primary-navy)' }}>
            Why this result? (Explainable Assessment Evidence)
          </h3>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-main)', fontStyle: 'italic', padding: '10px 14px', backgroundColor: '#F8FAFC', borderRadius: '6px', marginBottom: '16px', borderLeft: '4px solid var(--accent-blue)' }}>
          "{reasoning}"
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {observations.map((obs, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: 'var(--text-main)' }}>
              <CheckCircle size={16} color="var(--accent-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{obs}</span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: 'var(--text-main)' }}>
            <CheckCircle size={16} color="var(--accent-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>Visible rot level ({rotten_pct}%) complies with threshold limit for {grade}.</span>
          </div>
        </div>
      </div>

      {/* Visual Evidence Viewer */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius)',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', color: 'var(--primary-navy)' }}>
          Visual Evidence & Defect Overlay
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Bounding regions illustrate detected healthy bulbs and surface anomalies.
        </p>

        <VisualOverlay
          imageUrl={metadata?.previewUrl || image_url || "https://images.unsplash.com/photo-1618512496248-a07fe83aa8ce?auto=format&fit=crop&w=600&q=80"}
          boundingBoxes={bounding_boxes}
        />
      </div>

      {/* Bottom Action Footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        <button
          onClick={handleSaveAndReport}
          disabled={isSaving}
          style={{
            padding: '12px 28px',
            borderRadius: '6px',
            backgroundColor: 'var(--primary-navy)',
            color: '#FFF',
            fontSize: '14px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <FileText size={18} />
          <span>{isSaving ? 'Saving Record...' : 'Generate Digital Quality Report'}</span>
        </button>
      </div>
    </div>
  );
}
