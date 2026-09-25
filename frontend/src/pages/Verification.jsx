import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, ShieldAlert, CheckCircle2, QrCode, FileText } from 'lucide-react';
import { verifyAssessmentId } from '../services/api';
import { GradingBadge, ConfidenceBadge } from '../components/ConfidenceBadge';

export default function Verification({ initialId = "ONQ-2026-001", setScreen, setSelectedAssessment }) {
  const [queryId, setQueryId] = useState(initialId);
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (idToVerify) => {
    const id = idToVerify || queryId;
    if (!id) return;
    setLoading(true);
    try {
      const res = await verifyAssessmentId(id.trim());
      setVerificationResult(res);
    } catch (e) {
      setVerificationResult({
        verified: false,
        message: "Verification lookup service temporary error."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleVerify(initialId);
  }, [initialId]);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '720px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          backgroundColor: '#ECFDF5',
          color: 'var(--accent-green)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 12px auto'
        }}>
          <ShieldCheck size={28} />
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary-navy)' }}>
          OniQ Assessment Verification Ledger
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
          Independently verify digital quality records for onion procurement batches.
        </p>
      </div>

      {/* Verification Lookup Form */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius)',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--primary-navy)', marginBottom: '8px' }}>
          Enter Assessment ID
        </label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="e.g. ONQ-2026-001"
            value={queryId}
            onChange={(e) => setQueryId(e.target.value)}
            style={{
              flex: '1',
              padding: '12px 14px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              fontSize: '14px',
              fontWeight: '700',
              textTransform: 'uppercase'
            }}
          />
          <button
            onClick={() => handleVerify(queryId)}
            disabled={loading}
            style={{
              padding: '12px 24px',
              backgroundColor: 'var(--primary-navy)',
              color: '#FFF',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Search size={16} />
            <span>{loading ? 'Verifying...' : 'Verify Record'}</span>
          </button>
        </div>
      </div>

      {/* Verification Result Card */}
      {verificationResult && (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: `2px solid ${verificationResult.verified ? '#059669' : '#DC2626'}`,
          borderRadius: 'var(--radius)',
          padding: '28px',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Header Status Tag */}
          <div style={{
            backgroundColor: verificationResult.verified ? '#D1FAE5' : '#FEE2E2',
            padding: '12px 16px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px'
          }}>
            {verificationResult.verified ? (
              <CheckCircle2 size={22} color="#059669" />
            ) : (
              <ShieldAlert size={22} color="#DC2626" />
            )}
            <div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: verificationResult.verified ? '#065F46' : '#991B1B' }}>
                {verificationResult.verified ? '✓ Official Assessment Record Verified' : '❌ Record Not Found'}
              </div>
              <div style={{ fontSize: '12px', color: verificationResult.verified ? '#047857' : '#B91C1C' }}>
                {verificationResult.verified 
                  ? `Cryptographic record match found on OniQ Procurement Ledger.`
                  : verificationResult.message}
              </div>
            </div>
          </div>

          {verificationResult.verified && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px', fontSize: '13px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>Assessment ID</span>
                  <strong style={{ fontSize: '16px', color: 'var(--primary-navy)' }}>{verificationResult.assessment_id}</strong>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>Batch ID</span>
                  <strong style={{ fontSize: '15px', color: 'var(--primary-navy)' }}>{verificationResult.batch_id}</strong>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>Procurement Center</span>
                  <strong>{verificationResult.procurement_center}</strong>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>Assessment Timestamp</span>
                  <strong>{verificationResult.date}</strong>
                </div>
              </div>

              <div style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px'
              }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
                    Quality Score & Category
                  </span>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--accent-green)' }}>
                    {verificationResult.quality_score} / 100
                  </div>
                </div>

                <div>
                  <GradingBadge grade={verificationResult.grade} />
                  <div style={{ marginTop: '6px' }}>
                    <ConfidenceBadge confidence={verificationResult.confidence} />
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '20px' }}>
                Summary: "{verificationResult.summary}"
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={async () => {
                    // Load record and jump to report page
                    setSelectedAssessment(verificationResult);
                    setScreen('report');
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--primary-navy)',
                    color: '#FFF',
                    fontSize: '13px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <FileText size={16} />
                  <span>View Full Verified Report</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
