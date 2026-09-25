import React from 'react';
import { Plus, CheckCircle, AlertTriangle, Layers, Award, FileText, ArrowRight, Building2, User, Sparkles } from 'lucide-react';
import StatCard from '../components/StatCard';
import { ConfidenceBadge, GradingBadge } from '../components/ConfidenceBadge';

export default function Dashboard({ assessments = [], setScreen, setSelectedAssessment, currentUser }) {
  const totalCount = assessments.length;
  const avgScore = totalCount > 0 
    ? Math.round(assessments.reduce((acc, curr) => acc + curr.quality_score, 0) / totalCount)
    : 0;
  const verifiedCount = assessments.filter(a => a.status === 'Verified').length;
  const pendingCount = assessments.filter(a => a.status === 'Pending' || a.confidence < 60).length;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      {/* Top Banner Header */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius)',
        padding: '24px 30px',
        marginBottom: '24px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '700', color: 'var(--accent-green)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
            <Building2 size={15} />
            <span>{currentUser?.center_name ? `${currentUser.center_name} • ${currentUser.agency || 'NAFED'}` : 'SIH 2026 Prototype • PS ID 26031'}</span>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
            {currentUser?.center_name ? `${currentUser.center_name} Quality Dashboard` : 'OniQ Procurement Quality Dashboard'}
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {currentUser?.inspector_name 
              ? `Center Code: ${currentUser.center_code} • Station Officer: ${currentUser.inspector_name} • Location: ${currentUser.location || 'Mandi Hub'}`
              : 'Standardized, explainable and traceable quality assessment of onion batches.'
            }
          </p>
        </div>

        <button
          onClick={() => setScreen('new_assessment')}
          style={{
            backgroundColor: 'var(--accent-green)',
            color: '#ffffff',
            padding: '12px 22px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 4px rgba(5, 150, 105, 0.3)',
            transition: 'transform 0.1s ease',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <Plus size={18} />
          <span>+ New Assessment</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <StatCard
          title="Total Assessments"
          value={totalCount}
          subtitle="Processed batch records"
          icon={Layers}
          color="var(--accent-blue)"
        />
        <StatCard
          title="Average Quality Score"
          value={totalCount > 0 ? `${avgScore} / 100` : '--'}
          subtitle={totalCount > 0 ? "Batch quality benchmark" : "No score calculated yet"}
          icon={Award}
          color="var(--accent-green)"
        />
        <StatCard
          title="Verified Records"
          value={verifiedCount}
          subtitle="Digitally signed & compliant"
          icon={CheckCircle}
          color="var(--accent-green)"
        />
        <StatCard
          title="Verification Required"
          value={pendingCount}
          subtitle="Low confidence flagged"
          icon={AlertTriangle}
          color="var(--accent-amber)"
        />
      </div>

      {/* Recent Assessments Section */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)' }}>
              Recent Assessment Records
            </h2>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {currentUser?.center_name 
                ? `Logged batch quality records for ${currentUser.center_name}`
                : 'Real-time quality log across centers'
              }
            </span>
          </div>

          {totalCount > 0 && (
            <button
              onClick={() => setScreen('history')}
              style={{
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--accent-blue)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <span>View All History</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>

        {/* Data Table OR Empty State */}
        {totalCount > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F1F5F9', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '12px 18px', fontWeight: '600' }}>Assessment ID</th>
                  <th style={{ padding: '12px 18px', fontWeight: '600' }}>Batch ID</th>
                  <th style={{ padding: '12px 18px', fontWeight: '600' }}>Procurement Center</th>
                  <th style={{ padding: '12px 18px', fontWeight: '600' }}>Quality Score</th>
                  <th style={{ padding: '12px 18px', fontWeight: '600' }}>Grade</th>
                  <th style={{ padding: '12px 18px', fontWeight: '600' }}>Confidence</th>
                  <th style={{ padding: '12px 18px', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '12px 18px', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assessments.map((item) => (
                  <tr key={item.id || item.assessment_id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.15s' }}>
                    <td style={{ padding: '14px 18px', fontWeight: '700', color: 'var(--primary-navy)' }}>
                      {item.assessment_id}
                    </td>
                    <td style={{ padding: '14px 18px', fontWeight: '600' }}>
                      {item.batch_id}
                    </td>
                    <td style={{ padding: '14px 18px', color: 'var(--text-muted)' }}>
                      {item.procurement_center}
                    </td>
                    <td style={{ padding: '14px 18px', fontWeight: '800', color: item.quality_score >= 75 ? 'var(--accent-green)' : 'var(--accent-amber)' }}>
                      {item.quality_score} / 100
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <GradingBadge grade={item.grade} />
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <ConfidenceBadge confidence={item.confidence} level={item.confidence_level} />
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        padding: '3px 8px',
                        borderRadius: '12px',
                        backgroundColor: item.status === 'Verified' ? '#D1FAE5' : '#FEF3C7',
                        color: item.status === 'Verified' ? '#059669' : '#D97706'
                      }}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <button
                        onClick={() => {
                          setSelectedAssessment(item);
                          setScreen('report');
                        }}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '4px',
                          border: '1px solid var(--border-color)',
                          backgroundColor: '#FFFFFF',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: 'var(--primary-navy)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        <FileText size={14} />
                        <span>Report</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{
            padding: '50px 20px',
            textAlign: 'center',
            backgroundColor: '#F8FAFC'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#ECFDF5',
              color: 'var(--accent-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <Sparkles size={28} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary-navy)', marginBottom: '8px' }}>
              Welcome, {currentUser?.center_name || 'Procurement Center'}!
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto 20px auto', lineHeight: '1.5' }}>
              This is your new isolated procurement dashboard. No assessment records have been logged for this center yet. Perform your first batch quality assessment to generate metrics!
            </p>
            <button
              onClick={() => setScreen('new_assessment')}
              style={{
                backgroundColor: 'var(--accent-green)',
                color: '#ffffff',
                padding: '12px 24px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '700',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 4px rgba(5, 150, 105, 0.3)',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <Plus size={18} />
              <span>Perform First Assessment</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

