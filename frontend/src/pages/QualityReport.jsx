import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Download, CheckCircle, ArrowLeft, ShieldCheck, Cpu } from 'lucide-react';
import { GradingBadge, ConfidenceBadge } from '../components/ConfidenceBadge';
import QualityCompositionChart from '../components/QualityCompositionChart';

export default function QualityReport({ assessment, setScreen }) {
  if (!assessment) return null;

  const {
    assessment_id = "ONQ-2026-001",
    batch_id = "BATCH-001",
    procurement_center = "Nashik Main Mandi (NAFED)",
    inspector_name = "R. K. Sharma",
    image_url = "https://images.unsplash.com/photo-1618512496248-a07fe83aa8ce?auto=format&fit=crop&w=600&q=80",
    healthy_pct = 82.0,
    damaged_pct = 8.0,
    rotten_pct = 2.0,
    sprouted_pct = 4.0,
    undersized_pct = 4.0,
    quality_score = 82,
    confidence = 94,
    confidence_level = "HIGH",
    grade = "GRADE A",
    status = "Verified",
    analysis_mode = "AI Vision Analysis Mode",
    observations = [],
    reasoning = "",
    created_at
  } = assessment;

  const formattedDate = created_at 
    ? new Date(created_at).toLocaleString("en-IN", { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : new Date().toLocaleString("en-IN", { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const verificationUrl = `${window.location.origin}/verify/${assessment_id}`;

  const handlePrint = () => {
    window.print();
  };

  const formatImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8ce?auto=format&fit=crop&w=600&q=80';
    if (url.startsWith('blob:') || url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
    if (url.startsWith('/')) return `http://localhost:8000${url}`;
    return `http://localhost:8000/${url}`;
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Top Action Bar (hidden on print) */}
      <div className="no-print" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <button
          onClick={() => setScreen('dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: '600',
            color: 'var(--text-muted)'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setScreen('verify')}
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
            <ShieldCheck size={14} color="var(--accent-green)" />
            <span>Verify Online</span>
          </button>

          <button
            onClick={handlePrint}
            style={{
              padding: '8px 18px',
              borderRadius: '6px',
              backgroundColor: 'var(--primary-navy)',
              color: '#FFF',
              fontSize: '13px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <Printer size={16} />
            <span>Print Report / Save PDF</span>
          </button>
        </div>
      </div>

      {/* PRINTABLE REPORT DOCUMENT BODY */}
      <div className="print-area" style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius)',
        padding: '40px',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative'
      }}>
        {/* Official Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          borderBottom: '2px solid var(--primary-navy)',
          paddingBottom: '20px',
          marginBottom: '24px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                backgroundColor: 'var(--primary-navy)',
                color: '#FFF',
                borderRadius: '6px',
                fontWeight: '800',
                fontSize: '22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                Q
              </div>
              <div>
                <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--primary-navy)', letterSpacing: '-0.5px' }}>
                  ONIQ DIGITAL QUALITY ASSESSMENT REPORT
                </h1>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.5px' }}>
                  INTELLIGENT ONION QUALITY ASSESSMENT • SIH 2026 PROTOTYPE
                </div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--accent-green)' }}>
              {assessment_id}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Date: {formattedDate}
            </div>
          </div>
        </div>

        {/* Metadata Summary Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          backgroundColor: '#F8FAFC',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
          fontSize: '12px'
        }}>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block' }}>Batch Identification</span>
            <strong style={{ fontSize: '14px', color: 'var(--primary-navy)' }}>{batch_id}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block' }}>Procurement Center</span>
            <strong style={{ fontSize: '13px', color: 'var(--primary-navy)' }}>{procurement_center}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block' }}>Assigned Inspector</span>
            <strong style={{ fontSize: '13px', color: 'var(--primary-navy)' }}>{inspector_name}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block' }}>Assessment Status</span>
            <strong style={{ fontSize: '13px', color: status === 'Verified' ? 'var(--accent-green)' : 'var(--accent-amber)' }}>{status}</strong>
          </div>
        </div>

        {/* Image & Key Ratings Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '24px', marginBottom: '28px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Assessed Sample Image
            </div>
            <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)', height: '160px' }}>
              <img
                src={formatImageUrl(image_url)}
                alt="Batch Sample"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justify: 'space-between' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{
                padding: '16px 24px',
                borderRadius: '8px',
                backgroundColor: quality_score >= 75 ? '#ECFDF5' : quality_score >= 50 ? '#FEF3C7' : '#FEE2E2',
                border: `1px solid ${quality_score >= 75 ? '#059669' : quality_score >= 50 ? '#D97706' : '#DC2626'}`,
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: quality_score >= 75 ? '#065F46' : quality_score >= 50 ? '#92400E' : '#991B1B', textTransform: 'uppercase' }}>
                  Quality Score
                </div>
                <div style={{ fontSize: '32px', fontWeight: '800', color: quality_score >= 75 ? '#059669' : quality_score >= 50 ? '#D97706' : '#DC2626', lineHeight: '1' }}>
                  {quality_score}<span style={{ fontSize: '14px', color: quality_score >= 75 ? '#047857' : quality_score >= 50 ? '#B45309' : '#B91C1C' }}>/100</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Assigned Category Grade
                </div>
                <GradingBadge grade={grade} />
                <div style={{ marginTop: '8px' }}>
                  <ConfidenceBadge confidence={confidence} level={confidence_level} />
                </div>
              </div>
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-muted)', backgroundColor: '#F1F5F9', padding: '10px 12px', borderRadius: '6px' }}>
              Mode: <strong>{analysis_mode}</strong> • Criteria: Configured prototype thresholds (to be validated with official standards).
            </div>
          </div>
        </div>

        {/* Quality Composition Breakdown */}
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary-navy)', marginBottom: '12px', textTransform: 'uppercase' }}>
            Visual Quality Breakdown
          </h3>
          <QualityCompositionChart
            healthy={healthy_pct}
            damaged={damaged_pct}
            rotten={rotten_pct}
            sprouted={sprouted_pct}
            undersized={undersized_pct}
          />
        </div>

        {/* Evidence & Justification */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary-navy)', marginBottom: '10px', textTransform: 'uppercase' }}>
            Evidence-Backed Assessment Summary
          </h3>
          <div style={{ fontSize: '13px', color: 'var(--text-main)', marginBottom: '10px', fontWeight: '600' }}>
            "{reasoning}"
          </div>
          <ul style={{ paddingLeft: '20px', fontSize: '12px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {observations.map((obs, idx) => (
              <li key={idx}>{obs}</li>
            ))}
          </ul>
        </div>

        {/* Footer with QR Code Verification */}
        <div style={{
          borderTop: '1px dashed var(--border-color)',
          paddingTop: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary-navy)' }}>
              Digital Audit & Verification Trace
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', maxWidth: '420px' }}>
              Scan QR code to independently verify this digital quality assessment record on the OniQ public ledger node.
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-light)', marginTop: '6px' }}>
              Generated by OniQ Platform • SIH 2026 Prototype
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <QRCodeSVG value={verificationUrl} size={90} level="M" />
            <div style={{ fontSize: '9px', fontWeight: '700', color: 'var(--primary-navy)', marginTop: '4px' }}>
              {assessment_id}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
