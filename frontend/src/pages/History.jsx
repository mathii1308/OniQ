import React, { useState } from 'react';
import { Search, Filter, FileText, ArrowUpDown } from 'lucide-react';
import { GradingBadge, ConfidenceBadge } from '../components/ConfidenceBadge';

export default function History({ assessments, setScreen, setSelectedAssessment }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');

  const filteredAssessments = assessments.filter((item) => {
    const matchesSearch = 
      item.batch_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.assessment_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.procurement_center?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGrade = gradeFilter === '' || item.grade === gradeFilter;

    return matchesSearch && matchesGrade;
  });

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Title */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)' }}>
          Assessment History & Audit Log
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Traceable historical database of onion batch quality assessments across centers.
        </p>
      </div>

      {/* Filter and Search Controls Bar */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius)',
        padding: '16px 20px',
        marginBottom: '20px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by Batch ID, Assessment ID or Center..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 38px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              fontSize: '13px'
            }}
          />
        </div>

        {/* Grade Filter Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} color="var(--text-muted)" />
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              fontSize: '13px',
              backgroundColor: '#FFF'
            }}
          >
            <option value="">All Grades</option>
            <option value="GRADE A">Grade A</option>
            <option value="GRADE B">Grade B</option>
            <option value="GRADE C">Grade C</option>
            <option value="MANUAL VERIFICATION">Manual Verification</option>
          </select>
        </div>
      </div>

      {/* Main Data Table */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F1F5F9', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '12px 18px', fontWeight: '600' }}>Assessment ID</th>
                <th style={{ padding: '12px 18px', fontWeight: '600' }}>Batch ID</th>
                <th style={{ padding: '12px 18px', fontWeight: '600' }}>Procurement Center</th>
                <th style={{ padding: '12px 18px', fontWeight: '600' }}>Date</th>
                <th style={{ padding: '12px 18px', fontWeight: '600' }}>Quality Score</th>
                <th style={{ padding: '12px 18px', fontWeight: '600' }}>Grade</th>
                <th style={{ padding: '12px 18px', fontWeight: '600' }}>Confidence</th>
                <th style={{ padding: '12px 18px', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '12px 18px', fontWeight: '600', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssessments.length > 0 ? (
                filteredAssessments.map((item) => {
                  const dateStr = item.created_at
                    ? new Date(item.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
                    : 'Today';

                  return (
                    <tr key={item.id || item.assessment_id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '14px 18px', fontWeight: '700', color: 'var(--primary-navy)' }}>
                        {item.assessment_id}
                      </td>
                      <td style={{ padding: '14px 18px', fontWeight: '600' }}>
                        {item.batch_id}
                      </td>
                      <td style={{ padding: '14px 18px', color: 'var(--text-muted)' }}>
                        {item.procurement_center}
                      </td>
                      <td style={{ padding: '14px 18px', color: 'var(--text-muted)' }}>
                        {dateStr}
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
                            gap: '4px'
                          }}
                        >
                          <FileText size={14} />
                          <span>View Report</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No matching assessment records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
